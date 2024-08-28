if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const UserModel = require('../models/user.schema');
const SongModel = require('../models/song.schema');
const BlacklistModel = require('../models/blacklist.schema');
const PaymentModel = require('../models/payment.schema');
const ReportModel = require('../models/report.schema');
const moment = require('moment');
const schedule = require('node-schedule');

// web3
const ethers = require('ethers');
const INFURA_ENDPOINT = process.env.ENDPOINT;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(INFURA_ENDPOINT);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const signerAddress = signer.address;

const contractAddress = '0xc363773e88cdf35331d16cd4b6cf2609f9b46d50';
const Copyright = require('../../../contracts/Copyright.json');
const contract = new ethers.Contract(contractAddress, Copyright.abi, signer);
const ContractWithSigner = contract.connect(signer);

const get_admin_accounts = async (req, res) => {
    try {
        const User = await UserModel.find({ isAdmin: true });
        if (!User) {
            return res.status(404).json({
                message: 'Admin account not found',
            });
        }

        return res.status(200).json({
            name: User.name,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const ban_account = async (req, res) => {
    const { profileId, days, reason } = req.body;
    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        let isBanned = User.isBanned;
        if (isBanned == true) {
            User.isBanned = false;
            await BlacklistModel.deleteOne({ type: 'user', ref: profileId });
        } else {
            User.isBanned = true;
            const bannedUtil = moment().add(days, 'days').toDate();
            await BlacklistModel.create({
                type: 'user',
                ref: profileId,
                expireDate: bannedUtil,
                reason: reason,
            });
        }
        await User.save();

        const message = isBanned
            ? 'User unbanned successfully'
            : 'User banned successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const update_ban_status = async () => {
    try {
        const now = new Date();

        const expiredBans = await BlacklistModel.find({
            type: 'user',
            expireDate: { $lte: now },
        });

        let hasBanned = false;
        for (const ban of expiredBans) {
            const user = await UserModel.findById(ban.ref);
            user.isBanned = false;
            await user.save();
            await BlacklistModel.deleteOne({ _id: ban._id });
            hasBanned = true;
        }
        if (hasBanned) {
            console.log('Expired bans have been updated successfully');
        }
    } catch (error) {
        console.error('Error occurred while running cron job', error);
    }
};

const get_account_ban_status_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        if (!User.isBanned) {
            return res.status(200).json({
                ban_status: User.isBanned,
                message: 'User is not banned',
            });
        }

        const blacklist = await BlacklistModel.findOne({
            type: 'user',
            ref: profileId,
        });
        return res.status(200).json({
            ban_status: User.isBanned,
            reason: blacklist.reason,
            expire_date: blacklist.expireDate,
            banned_at: blacklist.createdAt,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const job = schedule.scheduleJob('* * * * * *', async () => {
    await update_ban_status();
});

const set_verified_artist = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        let isVerified = User.isVerified;
        if (isVerified == true) {
            User.isVerified = false;
        } else {
            User.isVerified = true;
        }
        await User.save();

        const message = isVerified
            ? 'User unverified successfully'
            : 'User verified successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_all_accounts = async (req, res) => {
    try {
        const Users = await UserModel.find();
        let candidates = [];
        for (let i = 0; i < Users.length; i++) {
            if (!Users[i].isAdmin) {
                candidates.push(Users[i]);
            }
        }
        res.status(200).send(
            candidates.map((user) => {
                return {
                    id: user._id,
                    name: user.name,
                    isVerified: user.isVerified,
                    isBanned: user.isBanned,
                    createdAt: user.createdAt,
                    image: user.image,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const remove_account_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        await UserModel.deleteOne({ _id: profileId });

        return res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_all_songs = async (req, res) => {
    try {
        const Songs = await SongModel.find();
        const songsWithUserDetails = await Promise.all(
            Songs.map(async (song) => {
                const user = await UserModel.findById(song.uploader);
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    isVerified: song.isVerified,
                    isDisabled: song.isDisabled,
                    createdAt: song.createdAt,
                    image: song.image,
                    publicAddress: user ? user.publicAddress : null,
                    isPending: song.isPending,
                    transactionsId: song.transactionsId,
                };
            }),
        );
        res.status(200).send(songsWithUserDetails);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const cancel_copyright_request = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        if (Song.isPending == true) {
            Song.isPending = false;
            await Song.save();
        }

        return res.status(200).json({
            message: 'Request cancelled successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const set_verified_song = async (req, res) => {
    const songId = req.params.songId;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        const User = await UserModel.findById(Song.uploader);
        if (!User) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        if (User.publicAddress.length == 0) {
            return res.status(404).json({
                message: 'User needs to update public address',
            });
        }

        publicAddresses = [];
        except = [];
        publicAddresses.push(User.publicAddress);
        weights = [];
        weights.push(50);
        for (let i = 0; i < Song.collaborators.length; i++) {
            const collab_artist = await UserModel.findById(
                Song.collaborators[i],
            );
            if (!collab_artist.publicAddress) {
                except.push(collab_artist.name);
            } else {
                publicAddresses.push(collab_artist.publicAddress);
                weights.push(50); // 50% for each collaborator
            }
        }

        if (except.length > 0) {
            return res.status(404).json({
                message:
                    'Collaborators need to update public address: ' +
                    except.join(', '),
            });
        }

        collaborators = [];
        collaborators.push(User.name);
        for (let i = 0; i < Song.collaborators.length; i++) {
            const collab_artist = await UserModel.findById(
                Song.collaborators[i],
            );
            collaborators.push(collab_artist.name);
        }

        console.log(
            Song._id.toString(),
            Song.title,
            collaborators,
            publicAddresses,
            weights,
        );
        if (Song.isVerified == false) {
            const response = await ContractWithSigner.uploadMusic(
                Song._id.toString(),
                Song.title,
                collaborators,
                publicAddresses,
                weights,
            );

            await response.wait();
            console.log('Transaction Hash:', response.hash);
            Song.transactionsId = response.hash;
            Song.isVerified = true;
        }

        await Song.save();

        const message = Song.isVerified
            ? 'Song unverified successfully'
            : 'Song verified successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const remove_song_by_id = async (req, res) => {
    const songId = req.params.songId;

    try {
        const song = await SongModel.findById(songId);

        if (!song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        req.publicId = song.image.publicId;
        let log = await uploader.songThumbnailDestroyer(req, res);
        if (log.result !== 'ok') {
            return res.status(500).json({
                message: 'Error occured while deleting song',
            });
        }

        const coverimage = song.coverimg;
        if (JSON.stringify(coverimage) !== '{}') {
            const coverprofile = req.user.coverimage.publicId;
            if (coverimage.publicId !== coverprofile) {
                req.publicId = coverimage.publicId;
                log = await uploader.songThumbnailDestroyer(req, res);
                if (log.result !== 'ok') {
                    return res.status(500).json({
                        message: 'Error occured while deleting song',
                    });
                }
            }
        }

        await SongModel.deleteOne({ _id: song._id });

        return res.status(200).json({
            message: 'Song deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deactivate_song = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        Song.isDisabled = true;
        await Song.save();
        const expire_date = moment().add(365, 'days').toDate();
        await BlacklistModel.create({
            type: 'song',
            ref: songId,
            expireDate: expire_date,
            reason: 'Song is strictly prohibited',
        });

        return res.status(200).json({
            message: 'Song is deactivated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const activate_song = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        Song.isDisabled = false;
        await Song.save();
        await BlacklistModel.deleteOne({ type: 'song', ref: songId });

        return res.status(200).json({
            message: 'Song is activated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_dashboard_stats = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments();
        const totalSongs = await SongModel.countDocuments();
        const totalVerifiedArtists = await UserModel.countDocuments({
            isVerified: true,
        });
        const totalReports = await ReportModel.countDocuments();
        const totalTransactions = await PaymentModel.countDocuments();
        const totalWithdrawalRequests = await PaymentModel.countDocuments({
            type: 'withdraw',
        });

        return res.status(200).json({
            totalUsers,
            totalSongs,
            totalVerifiedArtists,
            totalReports,
            totalTransactions,
            totalWithdrawalRequests,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    cancel_copyright_request,
    get_admin_accounts,
    get_account_ban_status_by_id,
    ban_account,
    set_verified_artist,
    get_all_accounts,
    remove_account_by_id,
    get_all_songs,
    set_verified_song,
    remove_song_by_id,
    deactivate_song,
    activate_song,
    get_dashboard_stats,
};
