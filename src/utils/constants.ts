import path from "path";
/* eslint-disable */
const REGEX_EMAIL =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const REGEX_MOBILE = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const REGEX_USERNAME = /^[a-zA-Z0-9._-]{2,40}$/;
const REGEX_PASSWORD =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
const VALIDATOR = "validator";
const CONTROLLER = "controller";
const AUTHORIZER = "authorizer";
/* eslint-enable */
const DATE_FORMAT = "YYYY-MM-DD";
enum DATA_STATUS {
    INACTIVE = "inactive",
    ACTIVE = "active",
}
enum DATA_ENABLE {
    INACTIVE = "inactive",
    ACTIVE = "active",
}
enum NOTIFICATION_STATUS {
    READ = "read",
    UNREAD = "unread",
}
const BLOGS_IMAGE_PATH =
    process.env.NODE_ENV === "production"
        ? "/var/www/mean_blogs/backend/upload/blogs_image"
        : path.join(__dirname, "../../upload/blogs_image");
enum OTP_STATUS {
    ACTIVE = "active",
    EXPIRED = "expired",
}
enum OTP_TYPE {
    REGISTER = "register",
    FORGOT_PASSWORD = "forgot_password",
    LOGIN = "login",
}
const MakeQueryForMultipleValues = (
    searchValue: string,
    tableName: string,
    fieldName: string
): string => {
    let valuesWithOr: string = "";
    (<string>searchValue).split(",").map((x, i) => {
        if (x.trim().length < 1) return;
        i > 0
            ? (valuesWithOr =
                  valuesWithOr +
                  ` OR ${tableName}.${fieldName} ILIKE '%${x.trim()}%'`)
            : (valuesWithOr =
                  valuesWithOr +
                  `${tableName}.${fieldName} ILIKE '%${x.trim()}%'`);
    });
    return valuesWithOr;
};

const GetEnumQuery = (
    searchValue: string,
    tableName: string,
    fieldName: string
): string => {
    let valuesWithOr: string = "";
    (<string>searchValue).split(",").map((x, i) => {
        if (x.trim().length < 1) return;
        valuesWithOr =
            i === 0
                ? valuesWithOr.concat(
                      `${tableName}.${fieldName}::text ILIKE '%${x.trim()}%'`
                  )
                : valuesWithOr.concat(
                      `OR ${tableName}.${fieldName}::text ILIKE '%${x.trim()}%'`
                  );
    });
    return valuesWithOr;
};

const MultipleNumberQuery = (
    searchValue: string,
    tableName: string,
    fieldName: string
): string => {
    let allNumberValues: string = "";
    (<string>searchValue).split(",").map((x, i) => {
        if (isNaN(Number(x.trim())) === false) return;
        allNumberValues =
            i === 0
                ? allNumberValues.concat(`${Number(x.trim())}`)
                : allNumberValues.concat(`,${Number(x.trim())}`);
    });
    return `${tableName}.${fieldName} IN (${allNumberValues})`;
};
export {
    VALIDATOR,
    CONTROLLER,
    MakeQueryForMultipleValues,
    GetEnumQuery,
    MultipleNumberQuery,
    BLOGS_IMAGE_PATH,
    DATA_STATUS,
    DATA_ENABLE,
    OTP_STATUS,
    OTP_TYPE,
    REGEX_EMAIL,
    REGEX_MOBILE,
    REGEX_PASSWORD,
    REGEX_USERNAME,
    DATE_FORMAT,
    AUTHORIZER,
    NOTIFICATION_STATUS,
};
