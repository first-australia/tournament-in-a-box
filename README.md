# tournament-in-a-box

FIRST LEGO League regional director's tool for simplifying tournament operations.

## Features

This tool is meant to help a Tournament Director of FIRST Lego League tournaments generate many supporting files & organise their tournament.

- Overall tournament scheduling (start, lunch, finish)
- Game & judging scheduling
- Closing Powerpoint slides
- Printed resources
  - Tournament schedule
  - Judging schedule
  - Game schedule
  - Individual team schedules (their judging & game times)
  - Location signage
    - Individual pit table signage
    - Judge room signage
    - Miscellaneous 'Do not enter signage'
  - Award certificates
  - Practise table sign-up sheet

## Manual

TODO: step-by-step guide

## For developers

### Building a development copy

1. Ensure you have `yarn classic (v1)` installed (see section footnote)
2. Ensure you have `node 16` installed (see section footnote)
3. Clone the repository `git clone git@github.com:first-australia/tournament-in-a-box.git`
4. Install the dependencies `yarn install`

If you wish to develop a feature:

4. Create an issue in GitHub
5. Checkout the latest master, `git checkout master; git fetch; git pull`
6. Checkout into a new branch for development `git checkout -b ISSUE_NUMBER-dev-branch-title`
7. If master updates during your work run `git rebase master` (to rerun and your development commits after bringing master into your dev branch)
8. Push and create a GitHub PR `git push`

9. Use the commands `yarn test` & `yarn start` to run your development copy

### To deploy to production

We currently have a manual deploy system, we may implement proper GitHub actions sometime in the future.

Don't deploy from a branch other than `master`.

1. After running the steps above, ensure you are on the master branch with updated work `git checkout master; git fetch; git pull`
2. Run the pre-deploy (build) script `yarn predeploy`
3. Deploy to GitHub, on the `gh-pages` branch `yarn deploy`
   - NOTE: You do need your ssh keys setup, and to have write access to the repository for this
   - (see section footnote)

#### Using a container

Often containers are very useful for devs, so that they can separate the projects installations (like `yarn` & `node16`) from their main operation system (IE: we don't want to install many versions of `node` in our own computer). Containers also can help ensure consistencies in installation across different machines too.

I suggest Podman, though Docker is often interoperable too.

```sh
# In your .zprofile or .bashrc or (.bashalias or .zshalias (which is sourced by .bashrc or.zprofile))

alias ms16='podman run -it \
  --workdir /home/node/ \
  --rm=true \
  --volume=$HOME/.ssh:/root/.ssh:ro \
  --volume=$HOME/.config/git/config:/root/.gitconfig:ro \
  --volume=./:/home/node/ \
  --network=host node:16'
alias ms16d='ms16 yarn start'
alias ms16t='ms16 yarn test'
```

- `it` runs an interactive terminal (for when you don't use the `ms16d` or `ms16t` alias')
- `rm` deletes the container when you exit, to ensure you don't accumulate many containers
- `volume=$HOME/.ssh` is used to allow deploying
  - This shares your `ssh` public & private key, that you presumably have linked to GitHub
  - NOTE: this is not needed unless deploying to production
- `volume=$HOME/.config/git/config ...` is used to allow deploy
  - This shares your `git` email & username
  - NOTE: your git config file may be in your home directory instead: `~/.gitconfig`
  - NOTE: this is not needed unless deploying to production

### Software stack

This project mostly runs on the internet, served by GitHub Pages.

This project also can be delivered as a wine executable, with the aim of having it run offline from a USB at very remote events. This functionality may not have been tested in a long time.

- Node 16
- Javascript
- React
- Bootstrap ui components
- JQuery

There is no backend to this project, as it's simple all-in-your-browser software.

# Contribution

Virtually all of this repository has been made by Fred, head referee of FLL for FIRST Australia
