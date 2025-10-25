# 📝 Field JSON Schema Examples — Complete Phase 1

Each form field is stored as a JSON object with common properties.  
Below are examples for **all Phase 1 field types**.

---

## 1. Short Text

````json
{
  "id": "field_1",
  "type": "short_text",
  "label": "What’s your name?",
  "placeholder": "Enter your full name",
  "required": true,
  "defaultValue": "",
  "helpText": "Please enter your full legal name.",
  "disabled": false,
  "readOnly": false,
  "order": 1,
  "conditionalLogic": null,
  "maxLength": 100,
  "minLength": 2

}


## 2. Long Text

```son
{
  "id": "field_2",
  "type": "long_text",
  "label": "Describe your project",
  "placeholder": "Write here...",
  "required": false,
  "defaultValue": "",
  "helpText": "Please enter your full legal name.",
  "disabled": false,
  "readOnly": false,
  "order": 1,
  "conditionalLogic": null,
  "maxLength": 100,
  "minLength": 2

}

## 3. Email

```son
{
  "id": "field_3",
  "type": "email",
  "label": "Your email",
  "placeholder": "example@email.com",
  "required": true
}

## 4. Number

```son
{
  "id": "field_4",
  "type": "number",
  "label": "How many people?",
  "placeholder": "Enter a number",
  "required": true,
  "min": 1,
  "max": 100
}


## 5. Url

```son
{
  "id": "field_5",
  "type": "url",
  "label": "Your portfolio link",
  "placeholder": "https://",
  "required": false
}


## 6. Phone

```son
{
  "id": "field_6",
  "type": "phone",
  "label": "Your contact number",
  "placeholder": "+91 1234567890",
  "required": false
}


## 7. Dropdown/select

```son
{
  "id": "field_7",
  "type": "dropdown",
  "label": "Choose your country",
  "required": true,
  "multiple": false,
  "options": [
    { "label": "India", "value": "IN" },
    { "label": "USA", "value": "US" },
    { "label": "UK", "value": "UK" }
  ]
}

## 8. Multiple choice(Radio)

```son
{
  "id": "field_8",
  "type": "radio",
  "label": "Select your gender",
  "required": true,
  "options": [
    { "label": "Male", "value": "male" },
    { "label": "Female", "value": "female" },
    { "label": "Other", "value": "other" }
  ]
}


## 9. Checkboxes

```son
{
  "id": "field_9",
  "type": "checkboxes",
  "label": "Which services do you need?",
  "required": false,
  "options": [
    { "label": "Design", "value": "design" },
    { "label": "Development", "value": "development" },
    { "label": "Marketing", "value": "marketing" }
  ]
}


## 10. Yes/No

```son
{
  "id": "field_10",
  "type": "yes_no",
  "label": "Do you agree with the terms?",
  "required": true,
  "defaultValue": false
}


## 11. Date picker

```son
{
  "id": "field_11",
  "type": "date",
  "label": "Select your date of birth",
  "required": true,
  "defaultValue": null
}


## 12. Time picker

```son
{
  "id": "field_12",
  "type": "time",
  "label": "Choose meeting time",
  "required": false,
  "defaultValue": null
}

## 13. Date && Time

```son
{
  "id": "field_13",
  "type": "datetime",
  "label": "Select appointment slot",
  "required": true,
  "defaultValue": null
}


## 14. File upload

```son
{
  "id": "field_14",
  "type": "file",
  "label": "Upload your resume",
  "required": true,
  "multiple": false,
  "acceptedTypes": [".pdf", ".docx"],
  "maxFileSizeMB": 10
}


## 15. Image upload

```son
{
  "id": "field_15",
  "type": "image",
  "label": "Upload your company logo",
  "required": false,
  "multiple": false,
  "acceptedTypes": [".png", ".jpg", ".jpeg"],
  "maxFileSizeMB": 10
}


## 16. Heading/Title

```son
{
  "id": "field_16",
  "type": "heading",
  "label": "About You",
  "style": "h2",
  "orientation": "horizontal"

}


## 17. Paragraph/Description

```son
{
  "id": "field_17",
  "type": "paragraph",
  "label": "Please fill this section carefully."
}


## 18. Divider

```son
{
  "id": "field_18",
  "type": "divider",
  "style": "h2",
  "orientation": "horizontal"

}

## 19. Page break

```son
{
  "id": "field_19",
  "type": "page_break",
  "label": "Next →"
}
````
