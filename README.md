# acknowledge

✔️ A friendly way to prompt your users for acknowledgement using Bootstrap modals.

TODO: Do we include a polyfill for promises or nah? Maybe we include a version that does have it and one without?
TODO: Test w/ bootstrap 3 + 4

## Usage

To enable a modal to be used by `acknowledge`, you need to have at least one button with a `data-acknowledge` attribute.

Example:

```html
<div class="modal fade" id="modal-one">
	<div class="modal-dialog">
		<div class="modal-content">
			<button type="button" data-acknowledge="data-acknowledge">Continue</button>
		</div>
	</div>
</div>
```

_Please do not put `data-acknowledge` on the same button that also dismisses the modal - something disastrous could happen. `acknowledge` will close the modal automatically upon acknowledgement._

With JavaScript, you can call `acknowledge` by passing it a selector for the modal you want to target.

Using async/await:

```javascript
import acknowledge from "acknowledge";

(async () => {
	try {
		await acknowledge("#modal-one");
	} catch (err) {
		console.warn(err);
	}
})();
```

Using Promises:

```javascript
import acknowledge from "acknowledge";

acknowledge("#modal-one")
	.then(() => {
		/* continue */
	})
	.catch(console.warn);
```

## API

### acknowledge(target[, options]);

Opens a modal. Returns a promise that resolves upon `[data-acknowledge]` click, otherwise rejects if the modal is closed.

#### target

Type: `String|DOMElement|jQuery`

The target modal. Can be a selector (String), a DOMElement, or a jQuery object.

#### options.persist

Type: `Boolean`<br />
Default: `false`

Persists the user's acknowledgement. If `true` and the user acknowledges a modal, `acknowledge` will immediately resolve the next time it is called on that modal.

#### options.scope

Type: `String|DOMElement|jQuery`<br />
Default: `document`

Tells `acknowledge` where to search for the target. Can be a selector (String), a DOMElement, or a jQuery object.

## License

[MIT](https://oss.ninja/mit/conrad2134)
