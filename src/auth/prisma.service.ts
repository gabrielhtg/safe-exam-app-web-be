import { Injectable, OnModuleInit, INestApplication } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { EventEmitter } from "events";
import { emit } from "process";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    async create(
        data: {name: string,
        username: string,
        email: string,
        password: string,}
    ) :Promise<User>{
      return await this.user.create({ data,});
    }
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app:INestApplication){
        const emitter = new EventEmitter();
        emitter.on('beforeExit', async() => {
            await app.close();
        });
    }
}