# generator-ajb-boilerplate

Boilerplate code for working on static websites

## Setup
1. Download & install [Ruby](http://rubyinstaller.org/)
1. Install [Sass](http://sass-lang.com/install) with the command `gem install sass`
1. Download & install [ScssLint](https://github.com/brigade/scss-lint) with the command `gem install scss_lint`
1. Download & install [Node](https://nodejs.org)
1. Download & install [Grunt](http://gruntjs.com/)
1. From the root folder `npm install`. This will also run 'grunt' once complete.

## Starting the local development server
1. From the root folder `npm start` or `grunt`

## Files & Folders

## Code Guidelines

### General
* Use tabs for indentation

### HTML
* TODO

### Javascript
* TODO

### Sass
* Never use any vendor prefixes - the Autoprefixer task will automatically insert these to match the minimum browser support described in the `Gruntfile`
* Styling should *usually* not be tied to a specific html <element>. Instead, add a meaningful class name and add the styling to that.
* Containers start with the prefix 'container-'
* Components start with the prefix 'component-'
* Classes used to describe state start with the prefix 'is-'