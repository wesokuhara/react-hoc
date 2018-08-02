# withPolling

This HOC will execute a `pollFn()` at the specified frequency in milliseconds (default: `5000`). A subsequent poll interval is only executed after the previous poll interval completes. Polling will pause and resume based on the `visibilitychange` document event.

This component integrates with Redux to allow the poll function to dispatch an action.

## Example Usage

```js
class MyComponent extends Component {
  ...
}

const createPollingOptions = dispatch => {
  return {
    pollFn: bindActionCreators(actionCreator, dispatch),
    frequency: 5000 // optional
  };
};

export default withPolling(createPollingOptions)(MyComponent);
```
