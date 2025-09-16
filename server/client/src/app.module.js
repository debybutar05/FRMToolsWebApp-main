"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const groups_module_1 = require("./groups/groups.module");
const entities_module_1 = require("./entities/entities.module");
const group_entity_1 = require("./groups/entities/group.entity");
const entity_entity_1 = require("./entities/entities/entity.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'yourpassword',
                database: 'frmtools',
                entities: [group_entity_1.Group, entity_entity_1.EntityEntity],
                synchronize: true, // true supaya auto create table, untuk development
            }),
            groups_module_1.GroupsModule,
            entities_module_1.EntitiesModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
