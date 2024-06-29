import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LimitVisit, LimitVisitDocument } from '../domains/domain-limit-visit';
import { LimitVisitRepository } from '../repositories/limit-visit-repository';

@Injectable()
/*@Injectable()-декоратор что данный клас
 инжектируемый--тобишь в него добавляются
 зависимости
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * providers: []
 */
export class LimitVisitService {
  constructor(
    @InjectModel(LimitVisit.name)
    private limitVisitModel: Model<LimitVisitDocument>,
    protected limitVisitRepository: LimitVisitRepository,
  ) {}

  async checkLimitVisits(ip: string, url: string, date: string) {
    const newLimitVisit: LimitVisitDocument = new this.limitVisitModel({
      ip,
      url,
      date,
    });

    await this.limitVisitRepository.save(newLimitVisit);

    /*   ищу документы в которых (обращание с одного устройства) и
     (обращение на одинаковый url)*/

    const arrayDocuments = await this.limitVisitRepository.findVisitsByIPAndURL(
      ip,
      url,
    );

    const timeInterval = 10 * 1000;

    const maxRequests = 5;

    /*переведу дату в формат с которым можно  вычитание
    дат делать */

    const arrayData = arrayDocuments.map((document: LimitVisitDocument) => {
      const date = document.date;

      const visitDate = new Date(date);

      return visitDate;
    });

    /* из масива дат найду такие даты которые 
     со времени последнего запроса  имеют не более чем +10 секунд*/

    const visitsForTimeInterval = arrayData.filter(
      (elem) => new Date(date).getTime() - elem.getTime() < timeInterval,
    );

    if (visitsForTimeInterval.length > maxRequests) return true;

    return false;
  }
}
