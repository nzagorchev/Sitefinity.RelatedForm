# Sitefinity.RelatedForm

# Usage
Render a Sitefinity form dynamically. Display the form in an Item View.

The implementation for MVC uses a custom Controller and a classic MVC route.
The form can be rendered in the following manner:
```cs
@Html.Action("IndexCustom", "FormCustom", new { id = Model.Item.Fields.FormId }) 

@*Start FormId field*@
    <div>
        <strong>Form :</strong>

        <div>
		@* Using the content item property for the Form Id. *@
            @Html.Action("IndexCustom", "FormCustom", new { id = Model.Item.Fields.FormId }) 
        </div>

        <script>
		// Set the form Id to be sent with the form submission
            ; (function ($) {
                if (typeof window.FormData === 'undefined')
                    return;

                $(function () {
                    var formContainers = $('[data-sf-role="form-container"]');
                    formContainers.each(function (i, element) {
                        var formContainer = $(element);
                        var formIdElement = formContainer.find('input[data-sf-role="form-id"]');
                        formIdElement.attr('name', 'id');
                    });
                });
            })(jQuery);
        </script>

    </div>
    @*End FormId field*@
```
For WebForms use just the FormFieldControl and the bellow code in the template:
```cs
<%@ Register Assembly="Telerik.Sitefinity" Namespace="Telerik.Sitefinity.Modules.Forms.Web.UI" TagPrefix="sf" %>
  <sf:FormsControl runat="server" FormId='<%# (Eval("FormId") != null && !string.IsNullOrEmpty(Eval("FormId").ToString())) ? new Guid(Eval("FormId").ToString()) : Guid.Empty %>' UseAjaxSubmit="true" />
```
  
# Installation
Add the files from the repo. Use the sample Jon Applications module added. Include the code from the Global.asax.