Ext.setup({
	onReady: function() {
		Ext.regModel("Test", {
			fields : [
				{ name : "text",  type : "string" },
				{ name : "value", type : "string" }
			]
		});
		var store = new Ext.data.Store({
			model : "Test",
			data  : [
				{ text : "One" ,   value : "1" },
				{ text : "Two" ,   value : "2" },
				{ text : "Three" , value : "3" },
				{ text : "Four" ,  value : "4" },
				{ text : "Five" ,  value : "5" },
				{ text : "Six" ,   value : "6" }
			]
		});
		
		var onFieldChange = function(cmp, value) {
			console.log(value);
		}
		
		var listeners = {
			change: onFieldChange,
			selectionchange: onFieldChange
		};
		
		var p = new Ext.Panel({
			fullscreen : true,
			items      : [
				{
					xtype : "fieldset",
					title : "Ext.form.ux.touch.MultiSelect",
					items : [
						{
							xtype        : "multiselectfield",
							label        : "List",
							store        : store,
							displayField : "text",
							valueField   : "value",
							name         : "multiselect-list",
							itemWidth    : 400,
							itemType     : "list",
							listeners    : listeners
						},
						{
							xtype        : "multiselectfield",
							label        : "DataView",
							store        : store,
							displayField : "text",
							valueField   : "value",
							name         : "multiselect-dataview",
							itemWidth    : 400,
							itemType     : "dataview",
							listeners    : listeners
						},
						{
							xtype        : "multiselectfield",
							label        : "Picker**",
							store        : store,
							displayField : "text",
							valueField   : "value",
							name         : "multiselect-picker",
							itemWidth    : 400,
							itemType     : "picker",
							listeners    : listeners
						},
						{
							xtype: "textareafield",
							disabled: true,
							value: "**Picker version of the Ext.form.ux.touch.MultiSelect component does not support multiselect at this time."
						}
					]
				}
			]
		});
	}
});