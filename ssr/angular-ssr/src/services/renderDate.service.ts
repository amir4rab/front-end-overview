import { Injectable } from '@angular/core';

type GeneratedData = {
  renderedAt: string;
};

@Injectable()
export class RenderDateService {

  get(): GeneratedData {
    const date = new Date();
    const renderedAt = `${date.getUTCHours().toString().padStart(2, '0')}:${date
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}:${date
      .getUTCSeconds()
      .toString()
      .padStart(2, '0')}:${date
      .getUTCMilliseconds()
      .toString()
      .padStart(2, '0')}`;

    return {
      renderedAt,
    };
  }
}
