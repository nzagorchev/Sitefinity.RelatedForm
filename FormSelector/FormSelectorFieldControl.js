Type.registerNamespace("SitefinityWebApp.FormSelector");

SitefinityWebApp.FormSelector.FormSelectorFieldControl = function (element) {

    SitefinityWebApp.FormSelector.FormSelectorFieldControl.initializeBase(this, [element]);
    this._selectButton = null;
    this._doneButton = null;
    this._cancelButton = null;
    this._itemsSelector = null;
    this._selectorWrapper = null;
    this._selectedItemsList = null;
    this._selectDialog = null;
    this._modulesDataServicePath = null;
    this._moduleType = null;
    this._itemsFilter = "Visible==true";
    this._providerName = null;
    this._uiCulture = null;

    /*empty kendo observable array*/
    this._selectedItems = kendo.observable({ items: [] });

    this._selectButtonClickedDelegate = null;
    this._getSelectedItemsSuccessDelegate = null;
    this._removeSelectedItemDelegate = null;
    this._doneButtonClickedDelegate = null;
    this._cancelButtonClickedDelegate = null;
    this._binderDataBindingDelegate = null;
    this._onloadDelegate = null;
    this._guidEmpty = "00000000-0000-0000-0000-000000000000";
}

SitefinityWebApp.FormSelector.FormSelectorFieldControl.prototype =
{
    initialize: function () {
        SitefinityWebApp.FormSelector.FormSelectorFieldControl.callBaseMethod(this, "initialize");

        if (this._selectButton) {
            this._selectButtonClickedDelegate = Function.createDelegate(this, this._selectButtonClicked);
            $addHandler(this._selectButton, "click", this._selectButtonClickedDelegate);
        }

        if (this._doneButton) {
            this._doneButtonClickedDelegate = Function.createDelegate(this, this._doneButtonClicked);
            $addHandler(this._doneButton, "click", this._doneButtonClickedDelegate);
        }

        if (this._cancelButton) {
            this._cancelButtonClickedDelegate = Function.createDelegate(this, this._cancelButtonClicked);
            $addHandler(this._cancelButton, "click", this._cancelButtonClickedDelegate);
        }

        this._getSelectedItemsSuccessDelegate = Function.createDelegate(this, this._getSelectedItemsSuccess);

        this._removeSelectedItemDelegate = Function.createDelegate(this, this._removeSelectedItem);
        jQuery(this.get_element()).find(this.get_selectedItemsList()).delegate('.remove', 'click', this._removeSelectedItemDelegate);

        this._binderDataBindingDelegate = Function.createDelegate(this, this._binderDataBindingHandler);
        this._itemsSelector.add_binderDataBinding(this._binderDataBindingDelegate);

        this._onloadDelegate = Function.createDelegate(this, this.onload);
        Sys.Application.add_load(this._onloadDelegate);

        if (this.get_itemsSelector()) {
            this._selectDialog = jQuery(this.get_selectorWrapper()).dialog({
                autoOpen: false,
                modal: true,
                width: 410,
                height: "auto",
                closeOnEscape: true,
                resizable: false,
                draggable: false,
                zIndex: 5000,
                dialogClass: "sfSelectorDialog"
            });
        }
        /*bind the empty observable array to the list which is going to display it*/
        kendo.bind($(this.get_selectedItemsList()), this._selectedItems);
    },

    dispose: function () {
        SitefinityWebApp.FormSelector.FormSelectorFieldControl.callBaseMethod(this, "dispose");
        if (this._selectButton) {
            $removeHandler(this._selectButton, "click", this._selectButtonClickDelegate);
        }
        if (this._selectButtonClickedDelegate) {
            delete this._selectButtonClickedDelegate;
        }
        if (this._getSelectedItemsSuccessDelegate) {
            delete this._getSelectedItemsSuccessDelegate;
        }
        if (this._removeSelectedItemDelegate) {
            jQuery(this.get_element()).find(this.get_selectedItemsList()).undelegate('.remove', 'click', this._removeSelectedItemDelegate);
            delete this._removeSelectedItemDelegate;
        }
        if (this._doneButtonClickedDelegate) {
            delete this._doneButtonClickedDelegate;
        }
        if (this._cancelButtonClickedDelegate) {
            delete this._cancelButtonClickedDelegate;
        }
        if (this._binderDataBindingDelegate) {
            this._itemsSelector.remove_binderDataBinding(this._binderDataBindingDelegate);
            delete this._binderDataBindingDelegate;
        }
        if (this._onloadDelegate) {
            Sys.Application.remove_load(this._onloadDelegate);
            delete this._onloadDelegate;
        }

        this._selectedItems.items.splice(0, this._selectedItems.items.length);
    },

    /* --------------------  public methods ----------- */

    /*Gets the value of the field control.*/
    get_value: function () {
        /*on publish if we have items in the kendo observable array 
        we get their ids in a aray of Guids so that they can be persisted*/
        var data = this._selectedItems.toJSON();
        var selectedKeysArray = data.items;

        if (selectedKeysArray.length > 0)
            return selectedKeysArray[0].Id;//only one item
        else
            return this._guidEmpty;
    },

    /*Sets the value of the text field control.*/
    set_value: function (value) {
        /*clears the observable array*/
        this._selectedItems.items.splice(0, this._selectedItems.items.length);

        /*if there are related items get them through the dynamic modules' data service*/
        if (value != null && value != "" && value != this._guidEmpty) {
            var filterExpression = "";
            filterExpression = filterExpression + 'Id == ' + value.toString();

            /* 9.2 format: /?managerType=
            &providerName=
            &itemType=Telerik.Sitefinity.Forms.Model.FormDescription
            &provider=OpenAccessDataProvider
            &sortExpression=LastModified%20DESC
            &skip=0&take=50
            &filter=Id==fdf999a6-7f32-6b41-b61a-ff000079a113 */

            var data = {
                "itemType": this.get_moduleType(),
                "provider": this.get_providerName(),
                sortExpression: "LastModified DESC",
                skip: 0,
                take: 100000, // take 0 to take all does not work
                "filter": filterExpression
            };

            $.ajax({
                url: this.get_modulesDataServicePath(),
                type: "GET",
                dataType: "json",
                data: data,
                headers: { "SF_UI_CULTURE": this.get_uiCulture() },
                contentType: "application/json; charset=utf-8",
                /*on success add them to the kendo observable array*/
                success: this._getSelectedItemsSuccessDelegate
            });
        }

        this.raisePropertyChanged("value");
        this._valueChangedHandler();
    },


    /* -------------------- events -------------------- */

    /* -------------------- event handlers ------------ */

    onload: function () {
        this._itemsSelector.get_binder().set_clearSelectionOnRebind(false);
    },


    _binderDataBindingHandler: function (sender, args) {
        var selectedItems = this._selectedItems.items.toJSON();
        if (selectedItems) {
            var items = args.get_dataItem().Items;
            for (var i = 0, l = selectedItems.length; i < l; i++) {
                var selectedItem = selectedItems[i];
                var index = items.length;
                while (index--) {
                    var item = items[index];
                    if (item.Id === selectedItem.Id) {
                        items.splice(index, 1);
                    }
                }
            }
        }
    },

    _selectButtonClicked: function (sender, args) {
        this.get_itemsSelector()._selectorSearchBox.get_binderSearch()._multilingual = false;
        this.get_itemsSelector().set_itemsFilter(this._itemsFilter);
        this.get_itemsSelector().dataBind();
        this.get_itemsSelector().get_binder().clearSelection();
        this._selectDialog.dialog("open");
        this._selectDialog.dialog().parent().css("min-width", "525px");
        dialogBase.resizeToContent();

        return false;
    },

    _doneButtonClicked: function (keys) {
        if (keys != null) {
            /*replace with the newly selected item in the observable array*/
            var selectedItems = this._selectedItems.items;
            var items = this.get_itemsSelector().getSelectedItems();
            if (items.length > 0) {
                for (var i = 0, l = selectedItems.length; i < l; i++) {
                    var selectedItem = selectedItems[i];
                    var index = items.length;
                    while (index--) {
                        var item = items[index];
                        if (item.Id === selectedItem.Id) {
                            items.splice(index, 1);
                        }
                    }
                }
                var selectedItemToAdd = items[0];
                this._selectedItems.items.splice(0, this._selectedItems.items.length);
                this._selectedItems.items.push(selectedItemToAdd);
            }
        }
        this._selectDialog.dialog("close");
        dialogBase.resizeToContent();
    },

    _cancelButtonClicked: function (sender, args) {
        this._selectDialog.dialog("close");
        dialogBase.resizeToContent();
    },

    _getSelectedItemsSuccess: function (result) {
        /*push existing related items in the kendo observable array*/
        this._selectedItems.items.splice(0, this._selectedItems.items.length);
        this._selectedItems.items.push(result.Items[0]);
    },

    _removeSelectedItem: function (value) {
        var itemToRemove = $(value.target).siblings().first();
        var data = this._selectedItems.toJSON();
        /*find the index of the selected item and delete it*/
        for (var i = 0; i < data.items.length; i++) {
            if (data.items[i].Id == itemToRemove.data("id")) {
                this._selectedItems.items.splice(i, 1);
                break;
            }
        }
    },

    /* -------------------- private methods ----------- */

    /* -------------------- properties ---------------- */

    get_selectButton: function () {
        return this._selectButton;
    },
    set_selectButton: function (value) {
        this._selectButton = value;
    },

    get_itemsSelector: function () {
        return this._itemsSelector;
    },
    set_itemsSelector: function (value) {
        this._itemsSelector = value;
    },

    get_selectorWrapper: function () {
        return this._selectorWrapper;
    },
    set_selectorWrapper: function (value) {
        this._selectorWrapper = value;
    },

    get_selectedItemsList: function () {
        return this._selectedItemsList;
    },
    set_selectedItemsList: function (value) {
        this._selectedItemsList = value;
    },

    get_doneButton: function () {
        return this._doneButton;
    },
    set_doneButton: function (value) {
        this._doneButton = value;
    },

    get_cancelButton: function () {
        return this._cancelButton;
    },
    set_cancelButton: function (value) {
        this._cancelButton = value;
    },

    get_modulesDataServicePath: function () {
        return this._modulesDataServicePath;
    },
    set_modulesDataServicePath: function (value) {
        this._modulesDataServicePath = value;
    },

    get_moduleType: function () {
        return this._moduleType;
    },
    set_moduleType: function (value) {
        this._moduleType = value;
    },

    // Passes the provider to the control
    set_providerName: function (value) {
        var binder = this.get_itemsSelector();
        if (binder) {
            binder.set_providerName(value);
        }
        this._providerName = value;
    },

    // Gets the provider from the control
    get_providerName: function () {
        return this._providerName;
    },

    get_culture: function () {
    },

    set_culture: function (culture) {
    },

    // Gets the UI culture to use when visualizing a content.
    get_uiCulture: function () {
        return this._uiCulture;
    },
    // Sets the UI culture to use when visualizing a content.
    set_uiCulture: function (culture) {
        var binder = this.get_itemsSelector();
        if (binder && culture) {
            binder.set_uiCulture(culture);

            //We make sure that the culture condition will be last in the filter expression string in the request to the server
            this._itemsFilter = "Visible == true AND Culture == " + culture;
        }
        this._uiCulture = culture;
    }
};

SitefinityWebApp.FormSelector.FormSelectorFieldControl.registerClass("SitefinityWebApp.FormSelector.FormSelectorFieldControl", Telerik.Sitefinity.Web.UI.Fields.FieldControl, Telerik.Sitefinity.Web.UI.Scripts.IRequiresProvider, Telerik.Sitefinity.Web.UI.Fields.ILocalizableFieldControl);
