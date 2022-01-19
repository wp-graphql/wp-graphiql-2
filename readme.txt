=== WPGraphiQL 2.0 ===
Contributors: jasonbahl
Tags: GraphQL, WPGraphQL, GraphiQL, IDE, DevTools, Developer Tools, Tooling, Testing, Productivity, Headless, Gatsby, React, NextJS
Requires at least: 5.5
Requires PHP: 7.1
Stable Tag: 0.1.5
License: GPL-3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

=== Description ===

WPGraphiQL is a free, open source WordPress plugin that brings the GraphiQL IDE and other GraphQL tooling to the WordPress admin, with the goal of improving the developer experience around using GraphQL with WordPress.

This plugin is intended to be used with WPGraphQL (https://wordpress.org/plugins/wp-graphql)

== Changelog ==

= 0.1.5 =

- ([#22](https://github.com/wp-graphql/wp-graphiql-2/pull/22)): Fixes some styling issues re: scrollbars. Also removes spacing around the React app inside the WP Admin UI.


= 0.1.4 =

**Chores/Bugfixes**

- Fixes styles related to extra scrollbars showing up
- ([#19](https://github.com/wp-graphql/wp-graphiql-2/pull/19)): When expanded in fullscreen, show icon to contract the screen. Thanks @scottyzen!

= 0.1.3 =

**Chores/Bugfixes**

- ([#16](https://github.com/wp-graphql/wp-graphiql-2/pull/16)): Fixes a bug where the variables were always being reset to a hardcoded value.


= 0.1.2 =

**New Feature**

- ([#13](https://github.com/wp-graphql/wp-graphiql-2/pull/13)): Adds a full-screen toggle to the GraphiQL Toolbar. Super cool example of building a feature using the "extension" APIs. Thanks @scottyzen!
- ([#14](https://github.com/wp-graphql/wp-graphiql-2/pull/14)): Wraps the app with ApolloProvider. Extensions can make use of Apollo Client functions such as useQuery, etc.

= 0.1.1 =

**Chores/Bugfixes**

- ([#7](https://github.com/wp-graphql/wp-graphiql-2/pull/7)): Fixes bug where extensions weren't enqueueing properly. Fixes a bug with some style conflicts between Ant Design and GraphiQL.


= 0.1.0

- Introduce a new "Router" component with a left-side menu. This is setting the foundation for providing more tools in the future.
- Reorganizes the code

= 0.0.1 =

- Initial Release
