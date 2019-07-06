<p align="center">
  <img src="https://raw.githubusercontent.com/BenediktBertsch/Micro_TeamSpeak_FrontEnd/master/logo.png" width="150">
</p>

# TeamSpeak Frontend

## Build the project with your data

The FrontEnd is a bit more complicated you can customize the API address in the `feTeamSpeak/src/environments/environment.prod.ts` File as well the Website Title.
First you need to run the command `npm install`, therefore you need NodeJS installed.
After you did that you can build the Angular App; to do so use `ng build --prod`.
The generated files are now in `feTeamSpeak/dist/feTeamSpeak` you can take the whole folder and host it on your HTTP-Server.
I used NGINX, the configuration for a 'perfect' score of Lighthouse is in the `nginx` folder.

This project is dependent of the [API](https://github.com/BenediktBertsch/Micro_TeamSpeak_API) and the [TeamSpeak Bot](https://github.com/BenediktBertsch/Micro_TeamSpeak_Bot).
