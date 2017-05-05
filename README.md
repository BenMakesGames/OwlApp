# OwlApp

a simple one-way binding JS "framework". the "owl" stands for "One-Way Llllllllllllbinding" >_>

## Requirements

* jQuery

## Installation

```
<script src="/path/to/owlapp.js"></script>
```

but really, I hope you're using some kind of framework. I happen to use Symfony, with Assetic, so *I'd* do something like...

```
{% javascripts
    'path/to/your/js/jquery-X.Y.Z.js'
    'path/to/your/js/*'
    filter='?jsqueeze'
    output="js/app.js"
%}
    <script src="{{ asset_url }}"></script>
{% endjavascripts %}
{# you've already got something like this, right? probably no changes are necessary! #}
```

but I'm only as picky about frameworks as I am about where you put your whitespace: not very.

## How to Use

### Example 1

in your HTML:

```
<a href="#" data-owl="MyApp" data-owl-click="Click">I'm going to do something REALLY EXCITING!</a>
```

in some kind of JS file:

```
function OwlAppMyApp(app, $element)
{
    this.Click = function(e)
    {
        e.preventDefault();

        alert('Sorry. This was probably a little bit of a letdown...');
    }

    return this;
}
```

### Example 2

okay, let's make it a little MORE exciting...

in your HTML:

```
<ul data-owl="FlashMessages" data-owl-click="Dismiss" id="flash-message-container"></ul>
<form data-owl="SubmitFlash">
    <input type="text" name="message" />
    <button type="submit" data-owl-click="Flash">Flash</button>
    <!-- it'd be more-correct to use data-owl-submit on the form tag, but I wanted to
    demonstrate that the data-owl-* actions can be put on child elements, so... -->
</form>
```
    
in your CSS:

```
#flash-message-container
{
    display: none;

    position: fixed;
    list-style: none;
    cursor: pointer;

    top: 10%;
    left: 10%;
    width: 80%;
    padding: 1rem;
    margin: 0;
    box-sizing: border-box; /* old-school! */

    background-color: #eee;
    border: 1px solid #999;
}

#flash-message-container.shown
{
    display: block;
}
```
    
in your JS:

```
function OwlAppFlashMessages(app, $element)
{
    app.attachListener('flash', function(data) { // opening curly brace on the same line this time - yolo
        $element.append('<li>' + data.message + '</li>');
        $element.addClass('shown');
    });

    this.Dismiss = function() {
        $element.removeClass('shown');
        $element.empty();
    };

    return this;
}
```

in a more-different JS file; don't you dare tell me that you don't concat and minify your JS files!

```
function OwlAppSubmitFlash(app, $form)
{
    var $messageInput = $form.find('input[name=message]');

    this.Flash = function(e) {
        e.preventDefault();

        app.dispatch('flash', { message: $messageInput.val() });

        $messageInput.val('');
    };

    return this;
}
```

## More-thorough Documentation

### JS-side

your apps (let's just call them controllers from here on out, though) - your controllers - are functions whose names must be prefixed with "OwlApp". (if you're already making a JS-heavy, owl-themed web application, and this name conflicts, I apologize.)

your controllers will be invoked with "new" - they are actually object constructors! \*gasp\* - so should `return this;` in the end.

they'll be passed two parameters: the first is the OwlApp object itself (which you can use to do things like attach event listeners, and dispatch events); the second is a jQuery object of the element which this instance of the controller has been attached to.

for examples of all this stuff, check out the examples above!

### HTML-side

attach controllers to elements using the `data-owl` attribute.

on that attribute, or on any children attributes, you can attach any event handlers you like, using `data-owl-EVENTNAMEGOESHERE`, ex:

```
<form data-owl="EventTest" data-owl-submit="Submit">
    <ul>
        <li data-owl-click="Click">Click</li>
        <li data-owl-touchstart="Touch">Mouse up</li>
    </ul>
    <input type="text" data-owl-keyup="KeyUp" data-owl-change="Change" />
    <button type="submit">Submit</button>
</form>
````

for a full list of events, see: https://www.w3schools.com/jsref/dom_obj_event.asp

### Hey, Listen ###

attaching controllers within controllers is technically possible, but will lead to weirdness. for example:

```
<form data-app="FirstApp">
    <a href="#" data-app="SecondApp" data-app-click="Click">WEIRDNESS!</a>
</form>
```

**Q.** which controller's "Click" method will be invokved? 
**A.** BOTH!

I really can't recommend doing this - 'seems like it'd lead to super-weird and hard-to-debug code, but hey: I don't know your life.

## Your Code Has a Flaw!

![UNACCEPTABLE!](https://media3.giphy.com/media/QUaqJRizED5NC/giphy.gif)

let me know; I will fix it.
