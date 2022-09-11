// file:///Users/joey/repos/fyord-boilerplate/public/index.html

export const baseUrl = `${document.baseURI}index.html`;

export const Routes = {
  Home: baseUrl,
  NotFound: `${baseUrl}#not-found`,
  Test: `${baseUrl}#test`
};
