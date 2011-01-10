Ext.ns("Ext.form.ux.touch");

Ext.form.ux.touch.MultiSelect = Ext.extend(Ext.form.Select, {
	columns: 2,
	selectedItemCls: "x-multiselect-item-selected",
	itemWidth: 200,
	itemType: "list",
	multiSelect: true,
	delimiter: ",",
	
	getDataView: function() {
		return {
			xtype: "dataview",
			store: this.store,
			itemId: "list",
			scroll: false,
			multiSelect: this.multiSelect,
			simpleSelect: true,
			itemSelector: "div.x-multiselect-item",
			tpl: new Ext.XTemplate(
				'<div class="x-multiselect-wrap" style="-webkit-column-count: ' + this.columns + ';">',
					'<tpl for=".">',
						'<div class="x-multiselect-item">{' + this.displayField + '}</div>',
					'</tpl>',
				'</div>'
			)
		};
	},
	
	getList: function() {
		return {
			xtype: "list",
			store: this.store,
			itemId: "list",
			scroll: false,
			multiSelect: this.multiSelect,
			simpleSelect: true,
			itemTpl : [
				'<span class="x-list-label">{' + this.displayField + '}</span>',
				'<span class="x-list-selected"></span>'
			]
		};
	},
	
	getItemPanel: function() {
		if (!this.itemPanel) {
			var item;
			switch (this.itemType) {
				case "dataview" :
					item = this.getDataView();
					break;
				case "list" :
					item = this.getList();
					break;
			}
			
			if (typeof item === "undefined") {
				throw "Valid options for itemType - dataview, list, picker";
			}
			
			item.listeners = {
				scope: this,
				selectionchange: this.onListSelectionChange
			};
			
			this.itemPanel = new Ext.Panel({
				floating         : true,
				stopMaskTapEvent : false,
				hideOnMaskTap    : true,
				width            : this.itemWidth,
				cls              : "x-select-overlay",
				scroll           : "vertical",
				items            : item
			});
		}
		
		return this.itemPanel;
	},
	
	showComponent: function() {
		var itemType = this.itemType;
		if (itemType === "picker") {
			this.getPicker().show();
		} else {
			var itemPanel = this.getItemPanel();
			
			itemPanel.showBy(this.el, "fade", false);
		}
		this.isActive = true;
	},
	
	onListSelectionChange: function(sm, recs) {
		var numSelected = recs.length;
		
		if (numSelected > 0) {
			var values = [];
			for (var i = 0; i < numSelected; i++) {
				var rec = recs[i];
				values.push(rec.get(this.valueField));
			}
			this.setValue(values.join(this.delimiter));
			this.fireEvent("selectionchange", this, recs);
		} else {
			this.setValue("");
		}
	},
	
	setValue: function(value) {
		var idx = 0,
			hiddenField = this.hiddenField,
			text = [],
			rec;
		
		if (value === "") {
			text = [];
		} else {
			var values = value.split(this.delimiter);
			var valuesLen = values.length;
			for (var i = 0; i < valuesLen; i++) {
				idx = this.store.findExact(this.valueField, values[i]);
				rec = this.store.getAt(idx);
				text.push(rec.get(this.displayField));
			}
		}
		this.value = value;
		this.fieldEl.dom.value = text.join(this.delimiter);
		if (hiddenField) {
			hiddenField.dom.value = this.value;
		}
		this.fireEvent("change", this, this.getValue());
	},
	
	destroy: function() {
        Ext.form.ux.touch.MultiSelect.superclass.destroy.apply(this, arguments);
        Ext.destroy(this.itemPanel);
    }
});

Ext.reg("multiselectfield", Ext.form.ux.touch.MultiSelect);