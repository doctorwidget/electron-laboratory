# Electron-React-Lab Alpha

My first notes on this playground.

Wow, there are a lot of files here. Part of me likes the idea of starting
everything from scratch "so I really understand everything". But another part
of me says "you have already spent far to much time on bikeshedding in the
javascript ecosystem as it is". The JS tool ecosystem never stops evolving,
so it is pure fantasy to think you'll ever be an expert on it. Since this
boilerplate uses things you've decided you definitely want (`jest`, `eslint`,
`react`, etc), you should just run with it.

In any case, this is just a playground. Go ahead and use the boilerplate,
even though it seems super verbose. In an ideal world you won't actually
need to pay any attention to the vast majority of the pre-existing files.

With that in mind, try to keep all _your_ stuff here:

- docs files here in `{project}/docs/`
- my actual code in `{project}/app/`

Note that this boilerplate includes an _extremely complete_ set of React and
Redux boilerplate, in addition to the Electron boilerplate. Which is exactly as
promised, right? Again: I have spent countless hours bikeshedding, so I am
happy to accept whatever their approach is.

## The Git Triangle

See my [git triangle](./git_triangle.md) notes for details about correctly
setting up the three-way relationship between `electron-react-boilerplate`,
my github-based fork of that project under the name `electron-laboratory`,
and this local repository. I actually did a few commits without doing that
correctly, and then ended up starting over to do it right.

After setting everything up correctly, my local repository has _two_ remotes:

- the `origin` remote, with my github-based fork
- the `upstream` remote, where the original boilerplate repository lives.

I plan to do all of my work in a new **laboratory** branch, so that the two
master branches (`origin/master` and `upstream/master`) can remain as similar
as possible. As documented in `git_triangle.md`, I will also have an
`origin/laboratory` branch where my own actual development will go.

(Note to self: consider making that a standard practice, but use the name
`default` for the branch which inexorably diverges from the original
`upstream/master` branch.)

## Yarn

I installed `yarn` via `homebrew` just to use this boilerplate. It should be
available at the CLI. It needs to be updated/maintained via `brew`.

## Startup

I had to run `yarn install` _once_ and only _once_. That should never need
to be done again. NB: yarn uses a lot of cute lil' icons!

I had to run a couple of other build commands once before I could run the
included test suite:

```yml
$: yarn build-main
# lots of output elided: looks like a webpack step

$: yarn build-renderer
# another webpack step
```

## Key Scripts:

They have _dozens_ of scripts in `package.json`. The ones you'll want to start
with include (but are not limited to!):

```yml
$: yarn test
yarn run v1.9.4
$ cross-env NODE_ENV=test BABEL_DISABLE_CACHE=1 node --trace-warnings -r babel-register ./internals/scripts/RunTests.js
 PASS  test/reducers/counter.spec.js
 PASS  test/actions/counter.spec.js
 PASS  test/components/Counter.spec.js
 PASS  test/containers/CounterPage.spec.js

Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
Snapshots:   7 passed, 7 total
Time:        2.425s
Ran all test suites matching /test\/(?!e2e\/)[^\/]+\/.+\.spec\.js$/i.
✨  Done in 3.58s.
```

So that looks promising! You can see where those scripts are and you can see
how they're written. Hooray!

The recommendation is to do development via `yarn dev`:

```yml
$: yarn dev
# starts a very nice little hello worldish app
# demonstrates several key features:
# - menubar & menu items in place, including a popup "about electron"
# - routing between two screens via react-router (hooray)
# - classic counter, to show redux and react-redux (hooray)
# - an "odd only" counter button, to go along with standard "+" and "-" buttons
# - an "async" counter button, presumably to show redux-thunk (hooray)
```

This certainly looks promising!

`yarn start` looks like it always runs a fresh build (which `yarn dev` did not).
More importantly, it runs cooler and faster: `yarn dev` immediately made my hard
drive fan start blaring away, which is usually a bad sign for battery life, etc.

Also, in `dev` mode, the menus have menuitems for showing the dev tools and going
fullscreen. (I can definitely see why you wouldn't want the final version to offer
the dev tools option, but why leave out fullscreen?)

## Active Upgrades

I got nagged to upgrade Yarn after only a couple of weeks

```yml
# warning Your current version of Yarn is out of date. The latest version is "1.10.1", while you're on "1.9.4".
#info To upgrade, run the following command:
#$ brew upgrade yarn

> brew upgrade yarn

# ... elided

> yarn --version
# 1.10.1
```

## TODO:

- _done_ add a `dev/` folder as a sibling of `docs/`, for todo lists and things.
- _done_ get `redux-saga` integrated right from the start
- _done_ add incrementIfEven saga (action name, saga catcher, re-broadcast, component JSX)
- _done_ add decrementRequest saga (action name, saga catcher, re-broadcast, component JSX)
- _done_ interim commit
- _done_ add incrementIfOdd as a saga and _remove_ the thunk version
- _done_ add incrementAsync as a saga and _remove_ the thunk version
- _done_ rename `decrementRequest` to `decrementAsync` and refactor all tests & etc
- _done_ remove _all_ thunk references - let runtime errors tell you if you're missing any
- _done_ remove any jest test code that relied on thunks (if any)
- _done_ sanity tests with all redux-saga actions
- _done_ interim commit
- saga Jest tests! create `{project}/test/sagas/counter.spec.js`
- test for all worker sagas... no need for watcher saga tests, right?
- ifOdd and ifEven sagas get jest-tested with differing inputs!
- figure out how to jest the debounce effects of decrementRequest and incrementRequest
- interim commit
- create a test page of your own that you can navigate to
- put some font-awesome icon on this page somehow, because I want to confirm that's happening!
- do a _cancelable_ saga action, and a unit test for it
  something that starts a timer, which counts down from 10, but which can be canceled
  So it ends either when the countdown ends, or the user clicks abort
  Meanwhile, you _cannot_ start a new round until the old one ends
  This is basically 100% of the tricksy async logic of all psychophysics tests!
- see if you can you can figure out how to make the fullscreen menu item appear
  in both dev and start modes
- add some tarsier icons
- make the `about` screen show your own icons and versions, not the `electron` ones!
