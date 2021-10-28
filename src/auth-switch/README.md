# GraphiQL Auth Switch

The Auth Switch provides the ability for users to execute GraphQL queries
as a logged-in user or as a public user.

The default state is public.

When toggled, the state is stored in localStorage so it can be re-used.

![Screen Recording of WPGraphiQL 2 in action](../../img/graphiql-toggle-auth.gif)

This feature is built using the new hooks/filters provided in WPGraphiQL 2.0
