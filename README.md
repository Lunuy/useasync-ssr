# useasync-ssr
React useAsync for SSR. You can use [useAsync](https://github.com/streamich/react-use/blob/master/docs/useAsync.md) with SSR Support!

# How it works
When first `ReactDOM.renderToString` called, `AsyncManager` saves promises that requested in react tree. Then when `asyncManager.load` called, await all promises resolved or rejected. Next render, `AsyncManager` will fill async values. Then you can get filled html.

# Usage
```tsx
const app = express();

app.get('/render', async (req, res) => {
    const asyncManager = new AsyncManager();

    const Tree = (
        <AsyncProvider asyncManager={asyncManager}>
            <App/>
        </AsyncProvider>
    );

    // Scan tree
    ReactDOM.renderToString(Tree);
    Helmet.renderStatic();

    // Load async requests
    await asyncManager.load();

    // Filled content
    const content = ReactDOM.renderToString(Tree);

    const html = <Html content={content}/>;

    res.status(200);
    res.send(`<!doctype html>\n${ReactDOM.renderToString(html)}`);
    res.end();
});
```
Check out full [examples](https://github.com/Lunuy/useasync-ssr-examples)