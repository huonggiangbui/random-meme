import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { TheUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @UseGuards(JwtAuthGuard)
  @Post("reports/:object/:id")
  async createReport(@TheUser() user: User, @Body() body: { content: string }, @Param() params): Promise<void | Report> {
    return this.reportService.create(user, body.content, params.object, params.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete("reports/:id")
  async deleteReport(@TheUser() user: User, @Param('id') id: string): Promise<void> {
    return this.reportService.remove(user, id)
  }

}
