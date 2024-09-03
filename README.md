<!-- title: SoundVault -->
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="[csc13002-sound-vault.vercel.app](csc13002-sound-vault.vercel.app)">
    <img src="./frontend/src/assets/favicon.svg" alt="Logo" width="80" height="80">
  </a>
  <h1 align="center">SoundVault</h1>
  <p align="center">
    Decentralized application for digital music copyright
    <br />
    <a href="[csc13002-sound-vault.vercel.app](csc13002-sound-vault.vercel.app)">Live!</a>
  </p>
</div>

# Description
SoundVault is a decentralized application to support artists in music copyright management with the following highlighted features:

* **Song management:** get music copyright, view copyright, change thumbnail/cover, upload song
* **Playlist management:** change thumbnail/cover, add to/remove from playlist
* **Song explorer**
* **Song ranking chart**
* **Social features:** following, avatar/cover customization, recently played songs, liked playlist, notification, etc
* **Wallet (donate/withdraw/deposit):** supports for most banking account in Viet Nam to donate for favourite song
* **Share song profit equally by smart contract:** song profit is shared equally to song author and collaborators
* **Administrator view:** the application also offers administrator platform to control the quality of songs, resolve user problems and support them on song verification

SoundVault not only emphasizes core functionalities but also prioritizes UI/UX to ensure users can interact easily and benefit from high-quality reliability.

# Screenshots
![soundvault-screenshot](screenshots/screenshot1.png)
![soundvault-screenshot](screenshots/screenshot12.png)
![soundvault-screenshot](screenshots/screenshot11.png)
![soundvault-screenshot](screenshots/screenshot7.png)
![soundvault-screenshot](screenshots/screenshot9.png)
![soundvault-screenshot](screenshots/screenshot10.png)
![soundvault-screenshot](screenshots/screenshot8.png)
![soundvault-screenshot](screenshots/screenshot6.png)
![soundvault-screenshot](screenshots/screenshot5.png)
![soundvault-screenshot](screenshots/screenshot4.png)
![soundvault-screenshot](screenshots/screenshot3.png)
![soundvault-screenshot](screenshots/screenshot2.png)

# Tech stack
**Frontend** 
![ReactJS][React]

* **Backend:** Express.js, MongoDB, Ethers.js

# How to run
1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install` to install all dependencies (do it individually with `backend`, `frontend` and `root` directory).
3. Run `npm run start` in the `root` directory to concurrently start the server and client.

# Client
```
.
├── dist
|-- src
|   |-- components, features, hooks, pages, etc
|   |-- routes
|   |-- services
```

- **dist**: Automatically build with Vite and to be deployed
- **src**: The folder that contains the source code
- **src/components, features, hooks, pages**: The folder that contains the controllers which handle the requests
- **src/routes**: The folder that contains the routes which define the endpoints
- **src/services**: The folder that contains the services which handle the business logic

# Server
```
.
|-- src
|   |-- config
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   |-- utils
|   server.js
```

- **src**: The folder that contains the source code
- **src/config**: Database and cloud storage (Cloudinary) configuration
- **src/routes**: The folder that contains the routes which define APIs interface
- **src/controllers**: The folder that contains the services which handle the business logic
- **src/models**: The folder that contains such schemas: accounts, songs, playlists, etc
- **src/utils**: The folder that contains such functions to define axios request to setup payment protocol (PayOS)
- **src/middleware**: The folder that contains middlewares to manage authorization and middle-logic implementation (payment validation, file filter, etc)


<!-- MARKDOWN LINKS & IMAGES -->
[React]: https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black
[Express.js]: https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black
