// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

pragma experimental ABIEncoderV2;

/*
 * Copyright contract
 */
contract Copyright {
    // Music metadata
    struct Music {
        address uploader;
        uint256 uploadTime;
        string name;
        string artist;
        string songHash;
    }

    struct User {
        string[] upload_music_list;
        bool isValid;
    }

    // song lists
    Music[] internal musics;

    // user as key
    mapping(address => User) internal users;

    // song hash as key
    mapping(string => Music) internal music_hash;

    // (name, artist) as primary key
    mapping(string => mapping(string => Music)) internal music;

    // Name as primary key
    mapping(string => Music[]) internal music_artist_list;

    // Artist as primary key
    mapping(string => Music[]) internal artist_music_list;


    /* Public methods */

    function userExists() public view returns (bool) {
        return users[msg.sender].isValid;
    }

    function getUserInfo() public view returns (User memory) {
        return users[msg.sender];
    }

    function getUploadMusicList() public view returns (string[] memory) {
        return users[msg.sender].upload_music_list;
    }

    function findUploadMusic(string memory _songHash)
        public
        view
        returns (bool)
    {
        User memory user = users[msg.sender];
        string[] memory upload_list = user.upload_music_list;

        for (uint256 i = 0; i < upload_list.length; i++) {
            if (
                keccak256(abi.encodePacked(_songHash)) ==
                keccak256(abi.encodePacked(upload_list[i]))
            ) {
                return true;
            }
        }

        return false;
    }

    function uploadMusic(
        string memory _songHash,
        string memory _name,
        string memory _artist
    ) public {
        Music memory _music =
            Music(
                msg.sender,
                block.timestamp,
                _name,
                _artist,
                _songHash
            );

        // Global state update
        musics.push(_music);
        music[_name][_artist] = _music;
        music_hash[_songHash] = _music;
        music_artist_list[_name].push(_music);
        artist_music_list[_artist].push(_music);

        // User state update
        users[msg.sender].upload_music_list.push(_songHash);
    }

    function uploadMusic_batch(
        string memory _songHash,
        string memory _name,
        string memory _artist,
        address uploader_addr
    ) public {
        Music memory _music =
            Music(
                uploader_addr,
                block.timestamp,
                _name,
                _artist,
                _songHash
            );

        // Global state update
        musics.push(_music);
        music[_name][_artist] = _music;
        music_hash[_songHash] = _music;
        music_artist_list[_name].push(_music);
        artist_music_list[_artist].push(_music);

        // User state update
        users[uploader_addr].upload_music_list.push(_songHash);
    }

    function musicExists(string memory _name, string memory _artist) 
        public 
        view
        returns (bool)
    {
        Music memory _music = music[_name][_artist];
        address _uploader = _music.uploader;
        bool exists = _uploader != address(0);
        return exists;
    }

    function getMusic(string memory _name, string memory _artist)
        public
        view
        returns (Music memory)
    {
        Music memory _music = music[_name][_artist];

        return _music;
    }

    function getMusicList()
        public 
        view 
        returns (Music[] memory) 
    {
        return musics;
    }
    
    function getMusicArtistList(string memory _name)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory _music_artist_list = music_artist_list[_name];

        return _music_artist_list;
    }

    function getArtistMusicList(string memory _artist)
        public
        view
        returns (Music[] memory)
    {
        Music[] memory _artist_music_list = artist_music_list[_artist];

        return _artist_music_list;
    }       
}