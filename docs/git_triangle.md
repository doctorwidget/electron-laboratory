# The Git Triangle

I started by _forking_ the original `electron-react-boilerplate` repository on
the github website using their web UI. I then renamed it via the `settings` tab
(with the gear icon) on the web UI

Original: - https://github.com/chentsulin/electron-react-boilerplate

My Copy (after renaming): - https://github.com/doctorwidget/electron-laboratory

I then _cloned_ my own fork to a local directory:

```yml
$: cd ~/code/js/demo

$: git clone https://github.com/doctorwidget/electron-laboratory.git
#... elided
```

Then I setup an _upstream_ relationship between my _local_ copy and the original _pre-fork_
repository. This allows me to pull from the upstream (I can obviously never push to it),
in addition to pulling and pushing to master.

```yml
$: git remote add upstream https://github.com/chentsulin/electron-react-boilerplate

$: git remote -v
origin	https://github.com/doctorwidget/electron-laboratory.git (fetch)
origin	https://github.com/doctorwidget/electron-laboratory.git (push)
upstream	https://github.com/chentsulin/electron-react-boilerplate (fetch)
upstream	https://github.com/chentsulin/electron-react-boilerplate (push)
```

Then I did the initial `yarn` related commands:

```yml
$: yarn install    # nb: no different than just typing "yarn"

# ... elided

# ... my yarn.lock now shows as different, ARGH

$: yarn build-main

# ... elided    must do this once before anything can run

$: yarn build-renderer

# ... also elided, and also required before you can run anything

# ... note that yarn.lock is still the only file registering as changed

$: yarn test

# ... all tests now pass hooray

$: yarn lint

#... a {warning} but no errors
```

So I gritted my teeth and committed that `yarn.lock` change, and pushed it to
_my_ origin/master. When the time comes that I want to bring in changes from
`upstream`, I worry this will cause some kind of terribly-hard-to-unravel
problem, but I'm resigned to just dealing with it then, since I don't see how I
could have avoided it.

## Origin/Laboratory

Then I created a new branch to do my own work in a new `laboratory` branch:

```yml
$: git checkout -b laboratory
```

After which I copied over the changed files from my aborted first attempt to
use `electron-react-boilerplate`. I used `git show` to see which
files could just be copied over wholesale. There weren't very many of them.
After doing my first commit to the `laboratory`, I wanted to make sure there
was remote version of that branch available, so I did this:

```yml
# first commit
$: git add .
$: git status
#... elided
$: git commit -m "first commit to laboratory branch, with redux-saga integration"


# now set up the remote tracking branch for origin/laboratory
$: git push -u origin laboratory
```

Now you can safely do both `git push origin laboratory` as you go, and switch
back to `master` as needed, if/when the original boilerplate project gets some
good new stuff in. All local work gets backed up to the remote github
repository, but you still retain your historical relationship with the original
project. It's the best of all worlds.

## Other Git Pearls

`git show abcd1234` will show you the _full_ commit information for the specified
commit.

`git show --pretty="" --name-only abcd1234` shows just the changed files. This was
handy when moving over a few small changes from an earlier forked experiment that
I didn't set up properly.

`git diff-tree --no-commit-id --name-only -r abcd1234` is a synonym (such as it is
for the preceding command. This one is the more "technical" version, and might be
more appropriate when scripting git commands.

`git remote -v` to reassure yourself that you have both an `origin` remote
(your forked github copy) and the `upstream` remote (your link to the original
repository)
