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

### Asset Management

Currently there are 3 valid types to create an asset `image`, `scaled` & `video`. All assets can be managed thorugh its provided utility. Depending on which type of asset you want to create you have to pass the expected parameters as explained below. To retreive an asset simply populate the asset and you have access to its `publicUrl` which can be assigned to our view. E.g.

```
if user.image
  img.profile-image(
    src=user.image.publicUrl
  )
```


##### Image

After a successful upload you can call `assetUtil.create()` and pass as type `image`, the uploaded file itself and the userId. Usually accessable through our request object like `req.user._id`.

```
assetUtil.create('image', file, userId, callback);
```


##### Scaled

Almost the same as `Image`. A scaled asset gives you the possibility to create a relation to its origin. In this case you can modify the `file` object and attach its origin asset id. 

```
file.origin = ASSET_OBJECT_ID

assetUtil.create('scaled', file, userId, callback);
```

##### Video

For an asset of type `video` you simply pass either a vimeo or a youtube link.

```
assetUtil.create('video', url, userId, callback);
```
