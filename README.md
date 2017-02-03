avnode
======

Setup
-----

We're using [nvm][nvm] to ensure that all people in the project use the same version of [node.js][nodejs], which is normally the latest LTS version.
We're using [docker][docker] for the database (and later probably the whole project).

[nvm]: https://github.com/creationix/nvm
[nodejs]: https://nodejs.org
[docker]: https://www.docker.com

### Quick Start

* Run `nvm use` in this directory to use a compatible version of nodejs.
* Run `docker-compose up -d` in this directory to start up mongodb in docker.
* Copy `example.env.local` to `.env.local`.
* Run `npm run dev` to run in development mode.

#### Asset Management

Images, videos or any other asset creates a record mongodbs `asset` collection. The file itself will be stored here `@see process.env.STORAGE`.
Each asset can have multiple `versions`. E.g. cropped, scaled or whatever…

To create an asset you can use `utilities/asset` which will return an mongoose ObjectId.

To request a asset you should use the `storage` route. E.g. `<img src="/storage/$USER.$IMAGE" />` (`$USER.$IMAGE` returns the asset id).
If you want to request a specific version you have to specify it like this `<img src="/storage/$USER.$IMAGE/500/200" />` (500 = witdh, 200 = height)
