// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;
pragma experimental ABIEncoderV2;

/*
 * Copyright contract
 */
contract Copyright {
    address public constant CONTRACT_OWNER =
        0x7C3E27a2317849A126847de19A50E0cbfc2a3b5A;

    struct Music {
        address[] song_shareholders;
        uint256 upload_time;
        string title;
        string song_hash;
        uint64[] weights;
    }

    address[] internal allowed_wallet; // list of administrator's public address
    Music[] internal uploaded_songs; // list of uploaded songs

    struct User {
        string name;
        bool isAdmin;
    }

    mapping(address => User) internal users;

    mapping(string => Music) internal music_hash; // trace song by hash

    /* Administrative */
    function addToAllowedWallet(address publicAddress) public returns (bool) {
        require(msg.sender == CONTRACT_OWNER, "You are not contract owner");

        if (users[publicAddress].isAdmin == false) {
            users[publicAddress].isAdmin = true;
            return true;
        }
        return false;
    }

    function removeFromAllowedWallet(
        address publicAddress
    ) public returns (bool) {
        require(msg.sender == CONTRACT_OWNER, "You are not contract owner");

        if (users[publicAddress].isAdmin == true) {
            users[publicAddress].isAdmin = false;
            return true;
        }
        return false;
    }

    /* Public methods */
    function getUploadedSongs() public view returns (Music[] memory) {
        return uploaded_songs;
    }

    function getSongByHash(
        string calldata song_hash
    ) public view returns (Music memory) {
        return music_hash[song_hash];
    }

    function uploadMusic(
        string calldata song_hash,
        string calldata title,
        string[] calldata collaborator,
        address[] calldata song_shareholders,
        uint64[] calldata weights
    ) public {
        require(
            users[msg.sender].isAdmin == true || msg.sender == CONTRACT_OWNER,
            "You dont have permission to perform such function"
        );

        Music memory _music = Music(
            song_shareholders,
            block.timestamp,
            title,
            song_hash,
            weights
        );

        music_hash[song_hash] = _music;
        uploaded_songs.push(_music);

        for (uint32 i; i < song_shareholders.length; i++) {
            if (bytes(users[song_shareholders[i]].name).length == 0) {
                users[song_shareholders[i]].name = collaborator[i];
                users[song_shareholders[i]].isAdmin = false;
            }
        }
    }

    function distributeSongFund(
        string memory song_hash,
        uint64 income
    ) public view returns (uint64[] memory) {
        require(msg.sender == CONTRACT_OWNER, "You are not contract owner");

        Music memory song_info = music_hash[song_hash];
        uint64[] memory distributed_money = new uint64[](
            song_info.weights.length
        );
        // weights[0] is author's money weight by default
        for (uint32 i; i < song_info.weights.length; ++i) {
            distributed_money[i] = income * song_info.weights[i];
        }

        return distributed_money;
    }
}
