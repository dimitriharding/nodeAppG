exports.models = {
    "Pet":{
      "id":"Pet",
      "required": ["id", "name"],
      "properties":{
        "id":{
          "type":"integer",
          "format":"int64",
          "description": "Unique identifier for the Pet",
          "minimum": "0.0",
          "maximum": "100.0"
        },
        "category":{
          "$ref":"Category",
          "description": "Category the pet is in"
        },
        "name":{
          "type":"string",
          "description": "Friendly name of the pet"
        },
        "photoUrls":{
          "type":"array",
          "description": "Image URLs",
          "items":{
            "type":"string"
          }
        },
        "tags":{
          "type":"array",
          "description": "Tags assigned to this pet",
          "items":{
            "$ref":"Tag"
          }
        },
        "status":{
          "type":"string",
          "description":"pet status in the store",
          "enum":[
            "available",
            "pending",
            "sold"
          ]
        }
      }
    }
  }