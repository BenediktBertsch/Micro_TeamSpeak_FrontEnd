## Build the project with your data

The FrontEnd is a bit more complicated you can customize the API address in the `feTeamSpeak/src/environments/environment.prod.ts` File as well the Website Title.
After you did that you can build the Angular App; to do so use `ng build --prod`.
The generated files are now in `feTeamSpeak/dist/feTeamSpeak` you can take the whole folder and host it on your HTTP-Server.
I used NGINX, the configuration for a 'perfect' score of Lighthouse is in the `nginx` folder.

This project is dependent of the [API](https://nodejs.org/en/) and the [TeamSpeak Bot](https://nodejs.org/en/).