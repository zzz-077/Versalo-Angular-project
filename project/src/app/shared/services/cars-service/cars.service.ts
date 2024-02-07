import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  Query,
  QueryFn,
} from '@angular/fire/compat/firestore';
import { filter, map } from 'rxjs';
import {
  carCardInterface,
  userInterface,
} from '../../interfaces/registerInterface';
@Injectable({
  providedIn: 'root',
})
export class CarsService {
  constructor(private fireStore: AngularFirestore) {}

  // Get Aall Cars
  getCarCollection() {
    const queryFn: QueryFn = (ref) => ref.orderBy('createdAt', 'desc');
    return this.fireStore
      .collection('/Cars', queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data() as carCardInterface;
            const id = action.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }
  // Get Cars After filtering
  getCarCollectionByFilter(filters: any) {
    const modifyFilters: any = {
      carModel: filters.Model?.toLowerCase() || null,
      carCategory: filters.category?.toLowerCase() || null,
      gearBox: filters.gearBox?.toLowerCase() || null,
    };
    const queryFn: QueryFn = (ref) => {
      let query: Query = ref;
      for (const key in modifyFilters) {
        if (modifyFilters[key]) {
          {
            query = query.where(key, '==', modifyFilters[key]);
          }
        }
      }
      return query.orderBy('createdAt', 'desc');
    };
    return this.fireStore
      .collection('/Cars', queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data() as carCardInterface;
            const id = action.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  getCarCollectionByUserId(id: string) {
    const queryFn: QueryFn = (ref) =>
      ref.where('userId', '==', id).orderBy('createdAt', 'desc');

    return this.fireStore
      .collection('/Cars', queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data() as carCardInterface;
            const id = action.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  // Get Car By ID
  getCarById(carId: string) {
    return this.fireStore.collection('/Cars').doc(carId).get();
  }

  // Add New Car
  async addNewCar(newCar: carCardInterface) {
    const modifyCar = { ...newCar, createdAt: new Date(), updatedAt: null };
    return await this.fireStore.collection('/Cars').add(modifyCar);
  }

  // Update Car
  async updateCar(carId: string, updatedCar: carCardInterface) {
    const modifyCar = { ...updatedCar, updatedAt: new Date() };

    return await this.fireStore.collection('Cars').doc(carId).update(modifyCar);
  }

  // Delete Cars By IDs
  async deleteCarsById(selectedIds: string[]) {
    console.log(selectedIds);

    selectedIds.forEach(async (id) => {
      return await this.fireStore.collection('/Cars').doc(id).delete();
    });
  }
  async addAllCarsFromOldDb() {
    for await (const car of carsDB) {
      this.fireStore.collection('/Cars').add(car);
    }
  }
}

const carsDB = [
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'toyota',
    carSeries: 'camry',
    carCategory: 'sedan',
    carYear: 2022,
    carPrice: 25000,
    carImg:
      'https://static.cargurus.com/images/forsale/2024/01/11/05/06/2023_toyota_camry-pic-6773326818692463280-1024x768.jpeg',
    carColor: 'black',
    gearBox: 'automatic',
    carDetails: 'Spacious interior, fuel-efficient',
    wheel: 'All-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'honda',
    carSeries: 'civic',
    carCategory: 'compact',
    carYear: 2023,
    carPrice: 22000,
    carImg:
      'https://www.pcarmarket.com/static/media/uploads/galleries/photos/uploads/galleries/26121-tom-white-civic/.thumbnails/F212D3D6-E699-4AC0-85C9-89E8356765DE.jpg/F212D3D6-E699-4AC0-85C9-89E8356765DE-tiny-2048x0-0.5x0.jpg',
    carColor: 'white',
    gearBox: 'manual',
    carDetails: 'Sporty design, great fuel economy',
    wheel: 'front-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'ford',
    carSeries: 'mustang',
    carCategory: 'sports car',
    carYear: 2022,
    carPrice: 35000,
    carImg:
      'https://cdn.dealeraccelerate.com/valley/1/91/4035/1920x1440/2022-ford-mustang-gt',
    carColor: 'yellow',
    gearBox: 'automatic',
    carDetails: 'Powerful engine, iconic design',
    wheel: 'rear-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'chevrolet',
    carSeries: 'malibu',
    carCategory: 'sedan',
    carYear: 2023,
    carPrice: 28000,
    carImg:
      'https://vehicle-images.dealerinspire.com/4d43-110006622/1G1ZD5ST2PF157772/8b7e348ceac13f45e64d7f88ef8954f5.jpg',
    carColor: 'black',
    gearBox: 'automatic',
    carDetails: 'Comfortable ride, advanced safety features',
    wheel: 'front-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'bmw',
    carSeries: 'x5',
    carCategory: 'suv',
    carYear: 2022,
    carPrice: 60000,
    carImg:
      'https://pictures.dealer.com/b/bmwoframseybmw/0136/1d31444bad749665a9f1e93eaa12be31x.jpg?impolicy=resize&w=640',
    carColor: 'white',
    gearBox: 'automatic',
    carDetails: 'Luxurious interior, powerful performance',
    wheel: 'all-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'mercedes-benz',
    carSeries: 'e-class',
    carCategory: 'luxury',
    carYear: 2023,
    carPrice: 55000,
    carImg:
      'https://thumb.vancdn.com/van/c/202401/04/13/83f5uMbiUh.b8858c62dd05ef896_w850_037d.jpg',
    carColor: 'white',
    gearBox: 'automatic',
    carDetails: 'Elegant design, cutting-edge technology',
    wheel: 'rear-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'audi',
    carSeries: 'a4',
    carCategory: 'sedan',
    carYear: 2022,
    carPrice: 42000,
    carImg:
      'https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0723/5d5369989465440f8c776c0a094ac208_ful.jpg',
    carColor: 'black',
    gearBox: 'automatic',
    carDetails: 'Premium features, smooth handling',
    wheel: 'all-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'nissan',
    carSeries: 'rogue',
    carCategory: 'suv',
    carYear: 2023,
    carPrice: 30000,
    carImg: 'https://inv.assets.ansira.net/7/2/1/32764837127.jpg',
    carColor: 'white',
    gearBox: 'automatic',
    carDetails: 'Versatile and spacious, fuel-efficient',
    wheel: 'front-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'hyundai',
    carSeries: 'elantra',
    carCategory: 'compact',
    carYear: 2022,
    carPrice: 20000,
    carImg:
      'https://media.ed.edmunds-media.com/hyundai/elantra/2022/oem/2022_hyundai_elantra_sedan_sel_fq_oem_1_815.jpg',
    carColor: 'blue',
    gearBox: 'automatic',
    carDetails: 'Affordable, good fuel economy',
    wheel: 'front-wheel drive',
  },
  {
    userId: 'HilCpWkntT0T8ZEPQPO8',
    carModel: 'kia',
    carSeries: 'seltos',
    carCategory: 'suv',
    carYear: 2023,
    carPrice: 24000,
    carImg:
      'https://media.ed.edmunds-media.com/kia/seltos/2023/oem/2023_kia_seltos_suv_sx_oem_1_815.jpg',
    carColor: 'red',
    gearBox: 'automatic',
    carDetails: 'Compact yet spacious, modern features',
    wheel: 'front-wheel drive',
  },
];

/** */

// const carsDB = [
//   {
//     id: 1,
//     userId: 1,
//     carModel: 'toyota',
//     carSeries: 'camry',
//     carCategory: 'sedan',
//     carYear: 2022,
//     carPrice: 25000,
//     carImg:
//       'https://static.cargurus.com/images/forsale/2024/01/11/05/06/2023_toyota_camry-pic-6773326818692463280-1024x768.jpeg',
//     carColor: 'black',
//     gearBox: 'automatic',
//     carDetails: 'Spacious interior, fuel-efficient',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 2,
//     userId: 1,
//     carModel: 'honda',
//     carSeries: 'civic',
//     carCategory: 'compact',
//     carYear: 2023,
//     carPrice: 22000,
//     carImg:
//       'https://www.pcarmarket.com/static/media/uploads/galleries/photos/uploads/galleries/26121-tom-white-civic/.thumbnails/F212D3D6-E699-4AC0-85C9-89E8356765DE.jpg/F212D3D6-E699-4AC0-85C9-89E8356765DE-tiny-2048x0-0.5x0.jpg',
//     carColor: 'white',
//     gearBox: 'manual',
//     carDetails: 'Sporty design, great fuel economy',
//     wheel: 'front-wheel drive',
//   },
//   {
//     id: 3,
//     userId: 1,
//     carModel: 'ford',
//     carSeries: 'mustang',
//     carCategory: 'sports car',
//     carYear: 2022,
//     carPrice: 35000,
//     carImg:
//       'https://cdn.dealeraccelerate.com/valley/1/91/4035/1920x1440/2022-ford-mustang-gt',
//     carColor: 'yellow',
//     gearBox: 'automatic',
//     carDetails: 'Powerful engine, iconic design',
//     wheel: 'rear-wheel drive',
//   },
//   {
//     id: 4,
//     userId: 1,
//     carModel: 'chevrolet',
//     carSeries: 'malibu',
//     carCategory: 'sedan',
//     carYear: 2023,
//     carPrice: 28000,
//     carImg:
//       'https://vehicle-images.dealerinspire.com/4d43-110006622/1G1ZD5ST2PF157772/8b7e348ceac13f45e64d7f88ef8954f5.jpg',
//     carColor: 'black',
//     gearBox: 'automatic',
//     carDetails: 'Comfortable ride, advanced safety features',
//     wheel: 'front-wheel drive',
//   },
//   {
//     id: 5,
//     userId: 1,
//     carModel: 'bmw',
//     carSeries: 'x5',
//     carCategory: 'suv',
//     carYear: 2022,
//     carPrice: 60000,
//     carImg:
//       'https://pictures.dealer.com/b/bmwoframseybmw/0136/1d31444bad749665a9f1e93eaa12be31x.jpg?impolicy=resize&w=640',
//     carColor: 'white',
//     gearBox: 'automatic',
//     carDetails: 'Luxurious interior, powerful performance',
//     wheel: 'all-wheel drive',
//   },
//   {
//     id: 6,
//     userId: 1,
//     carModel: 'mercedes-benz',
//     carSeries: 'e-class',
//     carCategory: 'luxury',
//     carYear: 2023,
//     carPrice: 55000,
//     carImg:
//       'https://thumb.vancdn.com/van/c/202401/04/13/83f5uMbiUh.b8858c62dd05ef896_w850_037d.jpg',
//     carColor: 'white',
//     gearBox: 'automatic',
//     carDetails: 'Elegant design, cutting-edge technology',
//     wheel: 'rear-wheel drive',
//   },
//   {
//     id: 7,
//     userId: 1,
//     carModel: 'audi',
//     carSeries: 'a4',
//     carCategory: 'sedan',
//     carYear: 2022,
//     carPrice: 42000,
//     carImg:
//       'https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/0723/5d5369989465440f8c776c0a094ac208_ful.jpg',
//     carColor: 'black',
//     gearBox: 'automatic',
//     carDetails: 'Premium features, smooth handling',
//     wheel: 'all-wheel drive',
//   },
//   {
//     id: 8,
//     userId: 6,
//     carModel: 'nissan',
//     carSeries: 'rogue',
//     carCategory: 'suv',
//     carYear: 2023,
//     carPrice: 30000,
//     carImg: 'https://inv.assets.ansira.net/7/2/1/32764837127.jpg',
//     carColor: 'white',
//     gearBox: 'automatic',
//     carDetails: 'Versatile and spacious, fuel-efficient',
//     wheel: 'front-wheel drive',
//   },
//   {
//     id: 9,
//     userId: 7,
//     carModel: 'hyundai',
//     carSeries: 'elantra',
//     carCategory: 'compact',
//     carYear: 2022,
//     carPrice: 20000,
//     carImg:
//       'https://vehicle-images.dealerinspire.com/98d4-110005178/thumbnails/large/KMHLM4DG4RU685895/ca15416d24fb3fed32690500c198f779.jpg',
//     carColor: 'red',
//     gearBox: 'manual',
//     carDetails: 'Affordable and reliable',
//     wheel: 'front-wheel drive',
//   },
//   {
//     id: 10,
//     userId: 6,
//     carModel: 'tesla',
//     carSeries: 'model 3',
//     carCategory: 'electric',
//     carYear: 2023,
//     carPrice: 45000,
//     carImg: 'https://teslamotorsclub.com/tmc/attachments/img_0849-jpg.776003/',
//     carColor: 'grey',
//     gearBox: 'automatic',
//     carDetails: 'Zero emissions, advanced autopilot',
//     wheel: 'all-wheel drive',
//   },
//   {
//     id: 11,
//     userId: 2,
//     carModel: 'kia',
//     carSeries: 'sportage',
//     carCategory: 'suv',
//     carYear: 2022,
//     carPrice: 23000,
//     carImg:
//       'https://static.cargurus.com/images/forsale/2023/12/20/07/33/2021_kia_sportage-pic-407597924573470164-1024x768.jpeg',
//     carColor: 'black',
//     gearBox: 'automatic',
//     carDetails: 'Compact and stylish',
//     wheel: 'front-wheel drive',
//   },
//   {
//     id: 12,
//     userId: 3,
//     carModel: 'subaru',
//     carSeries: 'outback',
//     carCategory: 'wagon',
//     carYear: 2023,
//     carPrice: 32000,
//     carImg:
//       'https://imotorcarsearch.s3.amazonaws.com/vehicles/large/2573096_S1260272_1_77415ef89267b18d.jpg',
//     carColor: 'blue',
//     gearBox: 'automatic',
//     carDetails: 'Rugged and versatile',
//     wheel: 'all-wheel drive',
//   },
//   {
//     id: 13,
//     userId: 4,
//     carModel: 'volkswagen',
//     carSeries: 'passat',
//     carCategory: 'sedan',
//     carYear: 2009,
//     carPrice: 15000,
//     carImg:
//       'https://atcimages.kbb.com/scaler/408/306/hn/c/d6dcc3ff70374dd9af26fcd446e84727.jpg',
//     carColor: 'Silver',
//     gearBox: 'manual',
//     carDetails: 'European styling, comfortable ride',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 14,
//     userId: 5,
//     carModel: 'mazda',
//     carSeries: 'cx-5',
//     carCategory: 'suv',
//     carYear: 2013,
//     carPrice: 19000,
//     carImg:
//       'https://cdn05.carsforsale.com/008ad932a58314f6845dbb60ed626d9855/1280x960/2013-mazda-cx-5-touring-4dr-suv.jpg',
//     carColor: 'Black',
//     gearBox: 'automatic',
//     carDetails: 'Sporty design, efficient fuel economy',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 16,
//     userId: 3,
//     carModel: 'bmw',
//     carSeries: 'x3',
//     carCategory: 'suv',
//     carYear: 2010,
//     carPrice: 26000,
//     carImg:
//       'https://cdn05.carsforsale.com/7828a17f491a5532e8ad1dfe072e735e/1280x960/2010-bmw-x3-xdrive30i-awd-4dr-suv.jpg',
//     carColor: 'blue',
//     gearBox: 'automatic',
//     carDetails: 'Luxury SUV with advanced features',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 17,
//     userId: 4,
//     carModel: 'audi',
//     carSeries: 'a4',
//     carCategory: 'sedan',
//     carYear: 2015,
//     carPrice: 28000,
//     carImg:
//       'https://f7432d8eadcf865aa9d9-9c672a3a4ecaaacdf2fee3b3e6fd2716.ssl.cf3.rackcdn.com/C513/U18970662/IMG_14617-large.jpg',
//     carColor: 'black',
//     gearBox: 'automatic',
//     carDetails: 'Premium sedan with cutting-edge technology',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 18,
//     userId: 6,
//     carModel: 'mercedes-benz',
//     carSeries: 'c-class',
//     carCategory: 'sedan',
//     carYear: 2012,
//     carPrice: 32000,
//     carImg:
//       'https://junkmailimages.blob.core.windows.net/large/1988b5f039524a93bb4bd520400bac48.jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Elegant design, luxury features',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 19,
//     userId: 7,
//     carModel: 'kia',
//     carSeries: 'sorento',
//     carCategory: 'suv',
//     carYear: 2008,
//     carPrice: 12000,
//     carImg:
//       'https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/1123/e0264b5ae53946d18770ee4f1a592ba9_hrs.jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Affordable SUV with comfortable seating',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 21,
//     userId: 5,
//     carModel: 'lexus',
//     carSeries: 'es',
//     carCategory: 'sedan',
//     carYear: 2013,
//     carPrice: 34000,
//     carImg:
//       'https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/1223/b70968aec265493d9e9663b9d851ae17_hrs.jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Best car ever',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 22,
//     userId: 3,
//     carModel: 'chrysler',
//     carSeries: '300',
//     carCategory: 'sedan',
//     carYear: 2007,
//     carPrice: 10000,
//     carImg:
//       'https://cs.copart.com/v1/AUTH_svc.pdoc00001/lpp/1123/cf6e4dcddd004ecba563dd5a2599b45a_hrs.jpg',
//     carColor: 'Blue',
//     gearBox: 'automatic',
//     carDetails: 'Bold design, comfortable interior',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 23,
//     userId: 1,
//     carModel: 'jeep',
//     carSeries: 'grand cherokee',
//     carCategory: 'suv',
//     carYear: 2011,
//     carPrice: 26000,
//     carImg:
//       'https://static.overfuel.com/photos/64/34480/202310-c7a059d1461742889a4197422290dd3a.webp',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Off-road capability, premium features',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 24,
//     userId: 2,
//     carModel: 'acura',
//     carSeries: 'mdx',
//     carCategory: 'suv',
//     carYear: 2009,
//     carPrice: 18000,
//     carImg:
//       'https://static.wikia.nocookie.net/acura/images/c/c4/2nd_Acura_MDX..jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Luxurious SUV with advanced safety',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 26,
//     userId: 3,
//     carModel: 'volvo',
//     carSeries: 'xc90',
//     carCategory: 'suv',
//     carYear: 2015,
//     carPrice: 30000,
//     carImg:
//       'https://upload.wikimedia.org/wikipedia/commons/9/95/2018_Volvo_XC90_2.0.jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Safety-focused SUV with a luxurious touch',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 27,
//     userId: 6,
//     carModel: 'jaguar',
//     carSeries: 'xf',
//     carCategory: 'sedan',
//     carYear: 2008,
//     carPrice: 16000,
//     carImg: 'https://trademe.tmcdn.co.nz/photoserver/480x360c/2083081434.jpg',
//     carColor: 'Black',
//     gearBox: 'automatic',
//     carDetails: 'Elegant design, high-end features',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 29,
//     userId: 1,
//     carModel: 'ford',
//     carSeries: 'mustang',
//     carCategory: 'sports car',
//     carYear: 2011,
//     carPrice: 25000,
//     carImg:
//       'https://upload.wikimedia.org/wikipedia/commons/d/d3/2011_Ford_Mustang_GT-CS_Black_Side_View.jpg',
//     carColor: 'Black',
//     gearBox: 'manual',
//     carDetails: 'Iconic muscle car with powerful performance',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 30,
//     userId: 5,
//     carModel: 'jeep',
//     carSeries: 'wrangler',
//     carCategory: 'suv',
//     carYear: 2015,
//     carPrice: 28000,
//     carImg:
//       'https://cf-img.autorevo.com/2015-jeep-wrangler-unlimited-albuquerque-nm-7241618/980x980/2870182-1-revo.jpg?_=1704343538',
//     carColor: 'Green',
//     gearBox: 'automatic',
//     carDetails: 'Off-road adventure and open-air driving',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 31,
//     userId: 6,
//     carModel: 'hyundai',
//     carSeries: 'elantra',
//     carCategory: 'sedan',
//     carYear: 2009,
//     carPrice: 12000,
//     carImg:
//       'https://imagescdn.dealercarsearch.com/Media/8276/19422028/638041073488185084.jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Economical and reliable',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 32,
//     userId: 3,
//     carModel: 'porsche',
//     carSeries: '911',
//     carCategory: 'sports car',
//     carYear: 1985,
//     carPrice: 35000,
//     carImg:
//       'https://cdn.ebizautos.media/used-1985-porsche-911-carreratarga5speedmanual-6383-21854789-1-1024.jpg',
//     carColor: 'White',
//     gearBox: 'manual',
//     carDetails: 'Timeless design with precision engineering',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 34,
//     userId: 2,
//     carModel: 'toyota',
//     carSeries: 'corolla',
//     carCategory: 'compact car',
//     carYear: 1980,
//     carPrice: 8000,
//     carImg:
//       'https://images.squarespace-cdn.com/content/v1/5b7da0b355b02c1acc11376e/1646945477569-JQLXK7XLHV5F01NGO68R/IMG_1891.JPG?format=1000w',
//     carColor: 'Red',
//     gearBox: 'manual',
//     carDetails: 'Reliable and fuel-efficient',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 38,
//     userId: 9,
//     carModel: 'ford',
//     carSeries: 'mustang',
//     carCategory: 'sports car',
//     carYear: 2011,
//     carPrice: 25000,
//     carImg:
//       'https://upload.wikimedia.org/wikipedia/commons/d/d3/2011_Ford_Mustang_GT-CS_Black_Side_View.jpg',
//     carColor: 'Black',
//     gearBox: 'manual',
//     carDetails: 'Iconic muscle car with powerful performance',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 39,
//     userId: 9,
//     carModel: 'jeep',
//     carSeries: 'wrangler',
//     carCategory: 'suv',
//     carYear: 2015,
//     carPrice: 28000,
//     carImg:
//       'https://cf-img.autorevo.com/2015-jeep-wrangler-unlimited-albuquerque-nm-7241618/980x980/2870182-1-revo.jpg?_=1704343538',
//     carColor: 'Green',
//     gearBox: 'automatic',
//     carDetails: 'Off-road adventure and open-air driving',
//     wheel: 'All-wheel drive',
//   },
//   {
//     id: 40,
//     userId: 9,
//     carModel: 'hyundai',
//     carSeries: 'elantra',
//     carCategory: 'sedan',
//     carYear: 2009,
//     carPrice: 12000,
//     carImg:
//       'https://imagescdn.dealercarsearch.com/Media/8276/19422028/638041073488185084.jpg',
//     carColor: 'Silver',
//     gearBox: 'automatic',
//     carDetails: 'Economical and reliable',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 41,
//     userId: 9,
//     carModel: 'porsche',
//     carSeries: '911',
//     carCategory: 'sports car',
//     carYear: 1985,
//     carPrice: 35000,
//     carImg:
//       'https://cdn.ebizautos.media/used-1985-porsche-911-carreratarga5speedmanual-6383-21854789-1-1024.jpg',
//     carColor: 'White',
//     gearBox: 'manual',
//     carDetails: 'Timeless design with precision engineering',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 42,
//     userId: 9,
//     carModel: 'volkswagen',
//     carSeries: 'beetle',
//     carCategory: 'compact car',
//     carYear: 1972,
//     carPrice: 12000,
//     carImg:
//       'https://kars4kidsgarage.com/wp-content/uploads/2021/08/790825_01X.jpg',
//     carColor: 'Blue',
//     gearBox: 'manual',
//     carDetails: 'Quirky and iconic compact car',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 43,
//     userId: 9,
//     carModel: 'toyota',
//     carSeries: 'corolla',
//     carCategory: 'compact car',
//     carYear: 1980,
//     carPrice: 8000,
//     carImg:
//       'https://images.squarespace-cdn.com/content/v1/5b7da0b355b02c1acc11376e/1646945477569-JQLXK7XLHV5F01NGO68R/IMG_1891.JPG?format=1000w',
//     carColor: 'Red',
//     gearBox: 'manual',
//     carDetails: 'Reliable and fuel-efficient',
//     wheel: 'Front-wheel drive',
//   },
//   {
//     id: 44,
//     userId: 9,
//     carModel: 'bmw',
//     carSeries: '2002',
//     carCategory: 'sedan',
//     carYear: 1974,
//     carPrice: 22000,
//     carImg:
//       'https://journal.classiccars.com/media/2023/05/36855070-1974-bmw-2002-std.jpg',
//     carColor: 'White',
//     gearBox: 'manual',
//     carDetails: 'Compact luxury with a sporty flair',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 45,
//     userId: 4,
//     carModel: 'opel',
//     carSeries: 'combo',
//     carCategory: 'van',
//     carYear: 2003,
//     carPrice: '1660',
//     carImg:
//       'https://firebasestorage.googleapis.com/v0/b/versalo-6135b.appspot.com/o/carImages%2Fimages.png?alt=media&token=5faa873d-2253-4b59-8a8f-edc527127e97',
//     carColor: 'blue',
//     gearBox: 'manual',
//     carDetails: 'car is in good shape ',
//     wheel: 'rear-wheel drive',
//     selected: false,
//   },
//   {
//     id: 50,
//     userId: 8,
//     carModel: 'porsche',
//     carSeries: '911',
//     carCategory: 'sports car',
//     carYear: 1985,
//     carPrice: 35000,
//     carImg:
//       'https://cdn.ebizautos.media/used-1985-porsche-911-carreratarga5speedmanual-6383-21854789-1-1024.jpg',
//     carColor: 'White',
//     gearBox: 'manual',
//     carDetails: 'Timeless design with precision engineering',
//     wheel: 'Rear-wheel drive',
//   },
//   {
//     id: 51,
//     userId: 1,
//     carModel: 'mercedes-benz',
//     carSeries: 'w212',
//     carCategory: 'sedan',
//     carYear: 1999,
//     carPrice: '4000',
//     carImg:
//       'https://firebasestorage.googleapis.com/v0/b/versalo-6135b.appspot.com/o/carImages%2Fw210.png?alt=media&token=cea8c595-b3bc-425d-bd69-bc5be7605dbe',
//     carColor: 'blue',
//     gearBox: 'manual',
//     carDetails: 'car in good condition',
//     wheel: 'rear-wheel drive',
//     selected: false,
//   },
//   {
//     id: 52,
//     userId: 1,
//     carModel: 'bmw',
//     carSeries: 'x6',
//     carCategory: 'suv',
//     carYear: 2013,
//     carPrice: '13000',
//     carImg:
//       'https://firebasestorage.googleapis.com/v0/b/versalo-6135b.appspot.com/o/carImages%2FUntitled.png?alt=media&token=c52bca8a-7beb-4665-bec0-d53efe938a63',
//     carColor: 'darkblue',
//     gearBox: 'automatic',
//     carDetails: 'car is in good condition',
//     wheel: 'front-wheel drive',
//     selected: false,
//   },
// ];
