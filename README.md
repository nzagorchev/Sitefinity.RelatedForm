# Sitefinity.RelatedForm

# Usage
Render a Sitefinity form dynamically. Display the form in an Item View.

The implementation for MVC uses a custom Controller and a classic MVC route.
The form can be rendered in the following manner:
```cs
@Html.Action("IndexCustom", "FormCustom", new { id = Model.Item.Fields.FormId }) // Using the content item property for the Form Id.
```
For WebForms use just the FormFieldControl and the bellow code in the template:
```cs
<%@ Register Assembly="Telerik.Sitefinity" Namespace="Telerik.Sitefinity.Modules.Forms.Web.UI" TagPrefix="sf" %>
  <sf:FormsControl runat="server" FormId='<%# (Eval("FormId") != null && !string.IsNullOrEmpty(Eval("FormId").ToString())) ? new Guid(Eval("FormId").ToString()) : Guid.Empty %>' UseAjaxSubmit="true" />
```
  
# Installation
Add the files from the repo. Use the sample Jon Applications module added. Include the code from the Global.asax.