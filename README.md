# cloud-build-badge 

[![npm version](https://badge.fury.io/js/cloud-build-badge.svg)](https://badge.fury.io/js/cloud-build-badge)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Automate the creation of [Google Cloud
Build](https://cloud.google.com/cloud-build/) badges for your project! Cloud
builds in the Google Cloud Platform are fun, but unlike Travis, Circle-CI, and
AppVeyor, it doesn't provide badges out-of-the-box. This small script aims to
provide a solution.

*(This is a fork of
[sbsends/cloud-build-badge](https://github.com/sbsends/cloud-build-badge) that
solves the same problem using `sed` commands and environment variables.  My aim
is to provide a more "JS-native" solution)*

I also wrote a blog post tutorial for creating Cloud Build badges. Read it [here](https://ljvmiranda921.github.io/notebook/2018/12/21/cloud-build-badge/)

## Setup

The first three steps ensure that we have the required badges in our project's
cloud storage. The last step simply install this package in your system.

1. Ensure that you have the [Google Cloud SDK](https://cloud.google.com/sdk/)
   installed in your system.
2. In your project, create a Google Cloud Storage bucket (referred to as
   `${BUCKET}`), and make a folder named `build`.
3. Inside `build/`, save an SVG copy of the SUCCESS and FAILURE badges. You can
   create your own [here](https://shields.io/#/), or you can just copy and save
   from here
   ([success](https://storage.googleapis.com/tm-github-builds/build/success.svg),
   [failure](https://storage.googleapis.com/tm-github-builds/build/failure.svg)).
4. Install `cloud-build-badge` via `npm`:

```shell
$ npm install cloud-build-badge
```

## Deploy

It only takes three steps to start deploying your cloud badges! First we create
the deploy script, then we call `gcloud functions` to send it over to GCP, then
we put the resulting badge in our project's README

1. Run `cloud-build-badge` and supply the following arguments:

```
--id            deploy function unique ID
--repository    target repository name
--branches      target branches, e.g. master, development
--bucket        name of bucket, e.g. ${BUCKET}
```

For example, 

```shell
cloud-build-badge \
    --id myFunction \
    --repository my-repository \
    --branches master development \ # You can supply multiple values
    --bucket my-project-bucket
```

This will generate a JS file (default is `function.js`) that
contains the deploy function that we'll need. 

2. Copy the resulting command to deploy via  `gcloud functions`. As
   reference, here's what it looks like:

```shell
gcloud functions deploy <ID> \
    --runtime nodejs6 \
    --trigger-resource cloud-builds \
    --trigger-event google.pubsub.topic.publish
```

3. You'll find the resulting badge saved inside your project's GCS bucket! You
   can then use it for your README's badge! This badge, through Cloud
   Functions, will change depending on the status of your latest build.

```
[![cloud build status](https://storage.googleapis.com/<BUCKET>/build/<REPOSITORY>-<BADGE>.svg)](https://github.com/ljvmiranda921/cloud-build-badge)
```

