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

## Other Git Pearls

`git show abcd1234` will show you the _full_ commit information for the specified
commit.

`git show --pretty="" --name-only abcd1234` shows just the changed files. This was
handy when moving over a few small changes from an earlier forked experiment that
I didn't set up properly.

`git diff-tree --no-commit-id --name-only -r abcd1234` is a synonym (such as it is
for the preceding command. This one is the more "technical" version, and might be
more appropriate when scripting git commands.
