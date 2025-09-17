import { Controller, Get, Req, Post, Body, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('api')
export class AppController {
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request) {
    return { csrfToken: req.csrfToken() };
  }

  @Post('login')
  login(@Body() body: any, @Res() res: Response) {
    const { username, password, company } = body;

    // Sementara: hardcode validasi dummy
    if (username === 'deby' && password === '1234') {
      return res.status(200).json({ message: 'Login success', company });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }
}
