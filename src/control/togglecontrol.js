/*	Copyright (c) 2016 Jean-Marc VIGLINO,
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/

import ol from 'ol'
import ol_control_Button from './buttoncontrol'
import ol_control_Control from 'ol/control/control'

/** A simple toggle control
 * The control can be created with an interaction to control its activation.
 *
 * @constructor
 * @extends {ol_control_Control}
 * @fires change:active, change:disable
 * @param {Object=} options Control options.
 *		className {String} class of the control
 *		title {String} title of the control
 *		html {String} html to insert in the control
 *		interaction {ol.interaction} interaction associated with the control
 *		active {bool} the control is created active, default false
 *		disable {bool} the control is created disabled, default false
 *		bar {ol.control.Bar} a subbar associated with the control (drawn when active if control is nested in a ol.control.Bar)
 *		autoActive {bool} the control will activate when shown in an ol.control.Bar, default false
 *		onToggle {function} callback when control is clicked (or use change:active event)
 */
var ol_control_Toggle = function(options)
{	options = options || {};
	var self = this;

	this.interaction_ = options.interaction;
	if (this.interaction_)
	{	this.interaction_.on("change:active", function(e)
		{	self.setActive(!e.oldValue);
		});
	}

	if (options.toggleFn) options.onToggle = options.toggleFn; // compat old version
	options.handleClick = function()
		{	self.toggle();
			if (options.onToggle) options.onToggle.call(self, self.getActive());
		};
	options.className = (options.className||"") + " ol-toggle";
	ol_control_Button.call(this, options);

	this.set("title", options.title);

	this.set ("autoActivate", options.autoActivate);
	if (options.bar)
	{	this.subbar_ = options.bar;
		this.subbar_.setTarget(this.element);
		$(this.subbar_.element).addClass("ol-option-bar");
	}

	this.setActive (options.active);
	this.setDisable (options.disable);
};
ol.inherits(ol_control_Toggle, ol_control_Button);

/**
 * Set the map instance the control is associated with
 * and add interaction attached to it to this map.
 * @param {_ol_Map_} map The map instance.
 */
ol_control_Toggle.prototype.setMap = function(map)
{	if (!map && this.getMap())
	{	if (this.interaction_)
		{	this.getMap().removeInteraction (this.interaction_);
		}
		if (this.subbar_) this.getMap().removeControl (this.subbar_);
	}

	ol_control_Control.prototype.setMap.call(this, map);

	if (map)
	{	if (this.interaction_) map.addInteraction (this.interaction_);
		if (this.subbar_) map.addControl (this.subbar_);
	}
};

/** Get the subbar associated with a control
* @return {ol_control_Bar}
*/
ol_control_Toggle.prototype.getSubBar = function ()
{	return this.subbar_;
};

/**
 * Test if the control is disabled.
 * @return {bool}.
 * @api stable
 */
ol_control_Toggle.prototype.getDisable = function()
{	return $("button", this.element).prop("disabled");
};

/** Disable the control. If disable, the control will be deactivated too.
* @param {bool} b disable (or enable) the control, default false (enable)
*/
ol_control_Toggle.prototype.setDisable = function(b)
{	if (this.getDisable()==b) return;
	$("button", this.element).prop("disabled", b);
	if (b && this.getActive()) this.setActive(false);

	this.dispatchEvent({ type:'change:disable', key:'disable', oldValue:!b, disable:b });
};

/**
 * Test if the control is active.
 * @return {bool}.
 * @api stable
 */
ol_control_Toggle.prototype.getActive = function()
{	return $(this.element).hasClass("ol-active");
};

/** Toggle control state active/deactive
*/
ol_control_Toggle.prototype.toggle = function()
{	if (this.getActive()) this.setActive(false);
	else this.setActive(true);
};

/** Change control state
* @param {bool} b activate or deactivate the control, default false
*/
ol_control_Toggle.prototype.setActive = function(b)
{	if (this.getActive()==b) return;
	if (b) $(this.element).addClass("ol-active");
	else $(this.element).removeClass("ol-active");
	if (this.interaction_) this.interaction_.setActive (b);
	if (this.subbar_) this.subbar_.setActive(b);

	this.dispatchEvent({ type:'change:active', key:'active', oldValue:!b, active:b });
};

/** Set the control interaction
* @param {_ol_interaction_} i interaction to associate with the control
*/
ol_control_Toggle.prototype.setInteraction = function(i)
{	this.interaction_ = i;
};

/** Get the control interaction
* @return {_ol_interaction_} interaction associated with the control
*/
ol_control_Toggle.prototype.getInteraction = function()
{	return this.interaction_;
};

export default ol_control_Toggle
