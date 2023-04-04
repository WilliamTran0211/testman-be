import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { State } from 'src/entities/state.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, State])],
    exports: [TypeOrmModule],
    controllers: [],
    providers: []
})
export class ProjectsModule {}
