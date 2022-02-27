const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const validator = require('validator')
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const SettingsSchema = new mongoose.Schema(
  {
    site: {
      title: {
        type: String,
        default: null,
        required: true,
      },
      logo: {
        type: String,
        default: null,
      },
      favicon: {
        type: String,
        default: null,
      },
      copyright: {
        type: String,
        default: null,
      },
      currency: {
        type: String,
        default: null,
      },
      currencycode: {
        type: String,
        default: null,
      },
      twilotoken: {
        type: String,
        default: null,
      },
      twilionumber: {
        type: String,
        default: null,
      },
      pub_pub_key: {
        type: String,
        default: null,
      },
      pub_sub_key: {
        type: String,
        default: null,
      },
      client_id: {
        type: String,
        default: null,
      },
      client_secret: {
        type: String,
        default: null,
      },
      default_language: {
        type: String,
        default: null,
      },
      customer_username: {
        type: String,
        default: null,
      },
      terms_user: {
        type: String,
        default: null,
      },
      terms_restaurants: {
        type: String,
        default: null,
      },
      default_location: {
        type: String,
        default: null,
      },
      amount_referral: {
        type: Number,
        default: 0,
      },
    },
    payment: {
      default_payment: {
        type: String,
        enum: ["CASH", "STRIPE"],
        default: "STRIPE",
      },
      stripe_charge: {
        type: Number,
        default: 0,
      },
      stripe_publish_key: {
        type: String,
        default: null,
      },
      stripe_secret: {
        type: String,
        default: null,
      },
      stripe_url: {
        type: String,
        default: null,
      },
    },
    productOrder: {
      deliverycost: {
        type: Number,
        default: 0,
      },
      dispute_responsetime: {
        type: Number,
        default: 0,
      },
      search_distance: {
        type: Number,
        default: 0,
      },
      deliveryman_responsetime: {
        type: Number,
        default: 0,
      },
      dish_commission: {
        type: Number,
        default: 0,
      },
      delivery_fee: {
        type: Number,
        default: 0,
      },
      orderlimit_min: {
        type: Number,
        default: 0,
      },
      orderlimit_max: {
        type: Number,
        default: 0,
      },
      order_assinged: {
        type: String,
        enum: ["MANUAL", "AUTOMATIC"],
        default: "MANUAL",
      },
    },
    app: {
      android_env: {
        type: String,
        default: null,
      },
      android_pushkey: {
        type: String,
        default: null,
      },
      ios_user_env: {
        type: String,
        default: null,
      },
      ios_provider_env: {
        type: String,
        default: null,
      },
      android_applink: {
        type: String,
        default: null,
      },
      ios_applink: {
        type: String,
        default: null,
      },
      iosprovider_pushpassword: {
        type: String,
        default: null,
      },
      iosshop_env: {
        type: String,
        default: null,
      },
      iosshop_pushpassword: {
        type: String,
        default: null,
      },
      iosuser_pushpassword: {
        type: String,
        default: null,
      },
      iosuser_topic: {
        type: String,
        default: null,
      },
      iosuser_apppassword: {
        type: String,
        default: null,
      },
      iosprovider_apptopic: {
        type: String,
        default: null,
      },
      iosprovider_apppassword: {
        type: String,
        default: null,
      },
      iosshop_apptopic: {
        type: String,
        default: null,
      },
      iosshop_apppassword: {
        type: String,
        default: null,
      },
    },
    social: {
      googlemap_key: {
        type: String,
        default: null,
      },
      twilio_sid: {
        type: String,
        default: null,
      },
      twilio_token: {
        type: String,
        default: null,
      },
      twilio_number: {
        type: String,
        default: null,
      },
      fb_client_id: {
        type: String,
        default: null,
      },
      fb_client_secret: {
        type: String,
        default: null,
      },
      fb_redirect: {
        type: String,
        default: null,
      },
      google_client_id: {
        type: String,
        default: null,
      },
      google_client_secret: {
        type: String,
        default: null,
      },
      google_redirect: {
        type: String,
        default: null,
      },
      link: {
        facebook: {
          type: String,
          validate: {
            validator: function (value) {
              return validator.isURL(value, {
                protocols: ["http", "https", "ftp"],
                require_tld: true,
                require_protocol: true,
              });
            },
            message: "Must be a Valid URL",
          },
        },
        twitter: {
          type: String,
          validate: {
            validator: function (value) {
              return validator.isURL(value, {
                protocols: ["http", "https", "ftp"],
                require_tld: true,
                require_protocol: true,
              });
            },
            message: "Must be a Valid URL",
          },
        },
        instagram: {
          type: String,
          validate: {
            validator: function (value) {
              return validator.isURL(value, {
                protocols: ["http", "https", "ftp"],
                require_tld: true,
                require_protocol: true,
              });
            },
            message: "Must be a Valid URL",
          },
        },
        pinterest: {
          type: String,
          validate: {
            validator: function (value) {
              return validator.isURL(value, {
                protocols: ["http", "https", "ftp"],
                require_tld: true,
                require_protocol: true,
              });
            },
            message: "Must be a Valid URL",
          },
        },
        vimeo: {
          type: String,
          validate: {
            validator: function (value) {
              return validator.isURL(value, {
                protocols: ["http", "https", "ftp"],
                require_tld: true,
                require_protocol: true,
              });
            },
            message: "Must be a Valid URL",
          },
        },
        youtube: {
          type: String,
          validate: {
            validator: function (value) {
              return validator.isURL(value, {
                protocols: ["http", "https", "ftp"],
                require_tld: true,
                require_protocol: true,
              });
            },
            message: "Must be a Valid URL",
          },
        },
      },
      is_sociallogin: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
SettingsSchema.index({
  site: 1,
  payment: 1,
  productOrder: 1,
  app: 1,
  social: 1,
});
SettingsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Settings", SettingsSchema);
