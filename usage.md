Once installed, you can then use it in your code as follows:

```js
import FileIcons  from '@gurupras/svg-file-icons'

const fileIcons = new FileIcons()
const icon = await fileIcons.getFileIcon('index.html')
console.log(icon)
{
  code: "f31b",
  colour: "#d28445",
  font: "font-awesome",
  path: "M1130 597l16-..."
  ref: "html5",
  viewBox: "0 0 1408 1792"
}
```

To create the SVG element:
```js
const svg = document.createElement('svg')
svg.setAttribute('viewBox', icon.viewBox)
svg.innerHTML = `<path d="${icon.path}"/>`
body.appendChild(svg)
```

### Rules
Icon types are actually matched by Regular Expression rules defined in Atom's icon database.
While these rules cover common use-cases, you may encounter that they miss out on a few.

For example, if you were to request an icon for file `a.out`, you would end up with the default icon.
However, we can do better by adding a new rule that returns the icon we want. In the following example, we will
create a new rule that returns Octicons' `file-binary` <img src="./file-binary.png" alt="Binary file icon"/>
</span> icon which seems appropriate for this file-type.

```js
/**
 * The rule format is:
 * rule = [
 *   match-rule,
 *   font-family,
 *   icon-name,
 *   priority (high value to override),
 *   colour (if any)
 * ]
 */
const ruleIndex = fileIcons.addRule([
  /.*\.out$/, // match-rule: Any file ending with '.out',
  'octicons', // font-family
  'file-binary', // icon-name
  999, // priority
  '#000' // colour: black
])
```

With this in place, we can now expect to receive our new icon every time a request is made for a `.out` file.

The above rule can be removed by running
```js
fileIcons.removeRule(ruleIndex)
```
