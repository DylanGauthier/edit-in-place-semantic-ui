# edit-in-place-semantic-ui
Super basic edit-in-place plugin for Semantic UI.
Needed this for another project and thought it'd be cool to share it.

There are things to fix, and things to implement :).

## Getting Started

### Prerequisites

 1. Semantic UI
 2. jQuery

### Usage

Grab and import ` dist/sui-eip.min.js` to your project.

Then change
```
<p>I want to become editable!</p>
```
to :
```
<p>
	<span class="whateveryouwant">I am now editable :D</span>
</p>
```

Then add 
```
$('.whateveryouwant').editable(options);
```

### Options

```
$('.whateveryouwant').editable({
	onChange:(ev) => console.log(ev)
});
```

 - **onChange** : Callback function when the input's value has been changed.

### TODO 
 - Do not allow editable elements like `body`, `table` and such.
 - Refactor code, pretty sure we can improve a lot.
 - Find limitations and fix them :).
