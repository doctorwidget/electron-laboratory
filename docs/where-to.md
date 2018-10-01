# Where To Change Stuff In Electron

Initial notes on where electron stuff gets changed, and any pearls on any topics
that catch my attention.

## Versions

There are _so many_ different systems cooperating in electron that it can
be very challenging to wrap your head around them all. Obviously you can peek at
`package.json`, but that won't tell you crucial details, like the versions of
your embedded `node`, `chrome`, and `v8`.

Fortunately, you can get them by running an `electron` REPL. Remember that
electron is in effect a repackaged and repurposed fork of `node` itself.
That means you can enter an `electron` REPL:

```yml
# from the project root
$: node_modules/.bin/electron --interactive
> process.version
'v8.9.3'
> process.versions
{ http_parser: '2.7.0',
  node: '8.9.3',
  v8: '6.1.534.41',
  uv: '1.15.0',
  zlib: '1.2.11',
  ares: '1.10.1-DEV',
  modules: '57',
  nghttp2: '1.25.0',
  openssl: '1.0.2n',
  electron: '2.0.6',
  chrome: '61.0.3163.100' }
```

It's that `process.versions` variable that we're interested in. Many electron
tutorials start out with a home page that prints the `node`, `chrome`, and
`electron` versions. Here you can see those and much more.

## System Menus

Many of these are _out of your hands_

For example, the eponymous menu after the apple menu -- this is based on the
_built package name_. As long as you're running **developer** builds, it's
always going to say `Electron`. Only after a real build will you see the name
of your app. That name will be taken from `package.json`.

## Window Title

Set this in your `app/app.html` page.

## Icons

App icon files live in `{project}/resources/`. But where are they wired up for
builds?

- the call to `new BrowserWindow` takes it as an option
- the `electron-builder` tool looks for them in standard locations
  https://www.electron.build/icons

Remember that [electron-build](https://www.electron.build/) is the most common
tool for actually packaging up your apps. It is downright _weird_ that this is
not a standard part of `electron`, but there it is! They're clearly taking the
unix strategy of making small tools that do just one thing. So `electron` lets
you _run_ your JS app, but it provides zero support for packaging everything
up into an `.exe` or `.app` file.

## OSX MenuItems and the .selector Property

When building menus for OSX (which is called `darwin` in Electron), the
`.selector` property in menuitems appears to map to standard OS commands:

- orderFrontStandardAboutPanel
- hide
- hideOtherApplications
- undo
- redo
- cut
- copy
- paste
- selectAll
- close
- arrangeInFront

Absolutely _none_ of which is documented in the electron code. I mean, I might expect
that I'd have to go to the Apple docs to learn about `hideOtherApplications`, but
why wouldn't the electron docs at least mention that the `.selector` property acts
as a bridge to these official OSX actions, which you'll have to read about further
in the Apple docs?

Also, `windows` does none of this, as far as I can tell.

## Running Windows On A Mac

I used to use boot camp, which was frankly a big hassle -- the hard barrier of
restarting made it fairly useless for cross-platform work. But Microsoft has
been somewhat humbled by their plummet towards irrelevance, and they now
support and distribute **free** Windows 10 virtual machines for use with
various virtual systems, including [virtualbox](https://www.virtualbox.org/),
which is free and open source.

- https://www.virtualbox.org/
- https://developer.microsoft.com/en-us/windows/downloads/virtual-machines
- http://osxdaily.com/2015/03/25/install-run-windows-10-mac-virtualbox-os-x/

Visual testing apps tend to involve simple static images changing at a stately
pace, and I have no aspirations to either run or write games, so the
performance of a purely virtualized windows should be fine.

It does look like the virtual machines from microsoft are time-limited with an
expiration date, so they are no good for use as a primary long-term machine.
But they're perfectly fine to make sure your `electron` app actually functions
in a windows environment. Which is exactly what I need and nothing more.
Hooray!
