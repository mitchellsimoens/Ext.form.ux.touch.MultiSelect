/*
    Author       : Mitchell Simoens
    Site         : http://simoens.org/Sencha-Projects/demos/
    Contact Info : mitchellsimoens@gmail.com
    Purpose      : Create more customizable Select field
    
    License      : GPL v3 (http://www.gnu.org/licenses/gpl.html)
    Warranty     : none
    Price        : free
    Version      : 1.0
    Date         : 01/09/2011
*/

Ext.ns("Ext.form.ux.touch");

Ext.form.ux.touch.MultiSelect = Ext.extend(Ext.form.Select, {
    columns: 2,
    selectedItemCls: "x-multiselect-item-selected",
    itemWidth: 200,
    itemType: "list",
    multiSelect: true,
    delimiter: ",",

    getDataView: function() {
        var config = this.itemConfig || {};
        
        Ext.applyIf(config, {
            xtype: "dataview",
            store: this.store,
            itemId: "list",
            scroll: false,
            multiSelect: this.multiSelect,
            simpleSelect: this.multiSelect,
            itemSelector: "div.x-multiselect-item",
            tpl: new Ext.XTemplate(
                '<div class="x-multiselect-wrap" style="-webkit-column-count: ' + this.columns + ';">',
                    '<tpl for=".">',
                        '<div class="x-multiselect-item">{' + this.displayField + '}</div>',
                    '</tpl>',
                '</div>'
            )
        });
        
        return config;
    },

    getList: function() {
        var config = this.itemConfig || {};
        
        Ext.applyIf(config, {
            xtype: "list",
            store: this.store,
            itemId: "list",
            scroll: false,
            multiSelect: this.multiSelect,
            simpleSelect: this.multiSelect,
            itemTpl : [
                '<span class="x-list-label">{' + this.displayField + '}</span>',
                '<span class="x-list-selected"></span>'
            ]
        });
        
        return config;
    },

    getItemPanel: function() {
        var me = this,
            item;

        if (!me.itemPanel) {
            switch (me.itemType) {
                case "dataview" :
                    item = me.getDataView();
                    break;
                case "list" :
                    item = me.getList();
                    break;
            }

            if (typeof item === "undefined") {
                throw "Valid options for itemType - dataview, list, picker";
            }

            item.listeners = {
                scope           : me,
                selectionchange : me.onListSelectionChange
            };

            me.itemPanel = new Ext.Panel({
                floating         : true,
                stopMaskTapEvent : false,
                hideOnMaskTap    : true,
                cls              : "x-select-overlay",
                scroll           : "vertical",
                items            : item,
                listeners        : {
                    scope : me,
                    hide  : me.destroyItemPanel
                }
            });
        }

        return me.itemPanel;
    },
    
    destroyItemPanel: function() {
        this.itemPanel.destroy();
        delete this.itemPanel;
    },
    
    showComponent: function() {
        var me       = this,
            itemType = me.itemType,
            value    = me.value,
            store    = me.store,
            v        = 0,
            recs     = [],
            itemPanel, values, vNum, idx, rec;

        if (itemType === "picker") {
            me.getPicker().show();
        } else {
            itemPanel = me.getItemPanel();

            itemPanel.showBy(me.el, "fade", false);
            
            if (value != "") {
                values = value.toString().split(",");
                vNum   = values.length;

                for (; v < vNum; v++) {
                    idx = me.findIndex(values[v]);

                    if (idx > -1) {
                        rec = store.getAt(idx);
                        recs.push(rec);
                    }
                }

                itemPanel.down('#list').getSelectionModel().select(recs, false, true)
            }
        }
        me.isActive = true;
    },

    onListSelectionChange: function(sm, recs) {
        var me         = this,
            valueField = me.valueField,
            delimiter  = me.delimiter,
            store      = me.store,
            rNum       = recs.length,
            r          = 0,
            values     = [],
            rec, itemPanel;

        if (rNum > 0) {
            for (; r < rNum; r++) {
                rec = recs[r];

                values.push(rec.get(valueField));
            }
            me.setValue(values.join(delimiter));
            me.fireEvent("selectionchange", this, recs);
        } else {
            me.setValue("");
        }
        if (!me.multiSelect) {
            itemPanel = me.getItemPanel();
            itemPanel.hide();
        }
    },

    setValue: function(value) {
        var me           = this,
            store        = me.store,
            hiddenField  = me.hiddenField,
            displayField = me.displayField,
            delimiter    = me.delimiter,
            idx          = 0,
            v            = 0,
            text         = [],
            rec, values, vNum;
        
        if (value.length > 0 || typeof value === "number") {
            if (typeof value === "string") {
                values = value.split(delimiter);
            } else {
                values = [value];
            }

            vNum = values.length;

            for (; v < vNum; v++) {
                idx = this.findIndex(values[v]);

                if (idx >= 0) {
                    rec = store.getAt(idx);

                    text.push(rec.get(displayField));
                }
            }
        }
        me.value             = value;
        me.fieldEl.dom.value = text.join(delimiter);

        if (hiddenField) {
            hiddenField.dom.value = me.value;
        }

        me.fireEvent("change", me, value);
    },

    findIndex: function(value) {
        var me         = this,
            valueField = me.valueField,
            store      = me.store,
            idx        = store.findBy(function(rec) {
                if (rec.get(valueField) === value) {
                    return true;
                }
            }, me);

        return idx;
    },

    destroy: function() {
        Ext.form.ux.touch.MultiSelect.superclass.destroy.apply(this, arguments);
        Ext.destroy(this.itemPanel);
    }
});

Ext.reg("multiselectfield", Ext.form.ux.touch.MultiSelect);