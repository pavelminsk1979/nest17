import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LimitVisit, LimitVisitDocument } from '../domains/domain-limit-visit';

@Injectable()
/*@Injectable()-декоратор что данный клас инжектируемый
 * ОБЯЗАТЕЛЬНО ДОБАВЛЯТЬ  В ФАЙЛ app.module
 * providers: []*/
export class LimitVisitRepository {
  constructor(
    @InjectModel(LimitVisit.name)
    private limitVisitModel: Model<LimitVisitDocument>,
  ) {}

  async save(newLimitVisit: LimitVisitDocument) {
    return newLimitVisit.save();
  }

  async findVisitsByIPAndURL(ip: string, url: string) {
    /*Если метод find() в Mongoose не найдет ни одного документа, соответствующего заданным критериям, он вернет пустой массив*/
    return this.limitVisitModel.find({ ip, url });
  }
}
