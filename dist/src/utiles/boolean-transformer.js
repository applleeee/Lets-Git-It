"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTransformer = void 0;
function isNullOrUndefined(obj) {
    return typeof obj === 'undefined' || obj === null;
}
class BooleanTransformer {
    from(dbValue) {
        if (isNullOrUndefined(dbValue)) {
            return;
        }
        return dbValue ? true : false;
    }
    to(value) {
        if (isNullOrUndefined(value)) {
            return;
        }
        return value ? 1 : 0;
    }
}
exports.BooleanTransformer = BooleanTransformer;
//# sourceMappingURL=boolean-transformer.js.map