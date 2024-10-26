// import { resolve } from 'path';
// import { pgConnection } from '../../data-source';
// import { rejects } from 'assert';
// import { MasterApi } from '../../../entities/masterApiTableEntity';
// import { UATOrder } from '../../../entities/UatApiOrderEntity';
// import { Cart } from '../../../entities/cartEntity';
// import { ILike, In } from 'typeorm';

// export class UserApiDB {
//   public getAllDataOfApi = (search: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let whareClouse = ' ';
//         if (search && typeof search === 'string' && search.trim() !== '') {
//           whareClouse = ` WHERE name ILIKE '%${search}%' OR api_type::text ILIKE '%${search.toLowerCase()}%' AND api_version_table.status = 1 `;
//         } else {
//           whareClouse = ` WHERE api_version_table.status = 1 `;
//         }
//         let query = `SELECT master_api_table.id, api_version_table.id AS api_ver_id, default_version, name, api_version_table.status, method, api_type, api_version, api_info, enviroment, api_version_table.created_at, api_version_table.updated_at FROM master_api_table JOIN api_version_table ON api_version_table.api_id = master_api_table.id${whareClouse}ORDER BY master_api_table.created_at DESC, api_version_table.created_at DESC`;
//         const apiList = await pgConnection.query(query);
//         resolve(apiList);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getApiById = (id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let query = `SELECT master_api_table.id AS master_api_id, api_version_table.id AS ap_ver_id, name, api_document, response_timeout, api_type, api_version, input, output, enviroment, method, uat_route, api_info FROM api_version_table JOIN master_api_table ON api_version_table.api_id = master_api_table.id WHERE api_version_table.id = ${id}`;
//         const items = await pgConnection.query(query);
//         resolve(items);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getApiByMasterVersion = (master_api_id: any, ap_version_id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let query = `SELECT * FROM api_version_table JOIN users_api_category_relation_table 
//         ON "masterApiTableId" = api_version_table.api_id WHERE id = ${ap_version_id} AND api_id = ${master_api_id}`;
//         const items = await pgConnection.query(query);
//         resolve(items);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getApiDefaultVersion = (search: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let parameters: any = [];
//         let whareClouse = ' ';
//         if (search && typeof search === 'string' && search.trim() !== '') {
//           whareClouse = ` WHERE api_version_table.status = 1 AND master_api_table.status = 1 AND api_version_table.default_version = true AND name ILIKE $1 OR api_type::text ILIKE $2 `;
//           parameters = [`%${search}%`, `%${search?.toLowerCase()}%`];
//         } else {
//           whareClouse = ` WHERE api_version_table.status = 1 AND master_api_table.status = 1 AND api_version_table.default_version = true `;
//         }
//         let query = `SELECT master_api_table.id AS master_api_id, api_version_table.id AS api_version_id, api_version_table.default_version, name, api_version_table.status, method, api_type, api_version, api_info, enviroment, api_version_table.created_at, api_version_table.updated_at FROM master_api_table JOIN api_version_table ON api_version_table.api_id = master_api_table.id${whareClouse}ORDER BY master_api_table.created_at DESC, api_version_table.created_at DESC;`;
//         console.log(query);
//         const items = await pgConnection.query(query, parameters);
//         resolve(items);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getSearchDataOnChanges = (search: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const data = await MasterApi.find({
//           where: { name: ILike(`%${search}%`), status: 1 },
//           take: 10,
//           select: { id: true, name: true },
//           relations: {
//             api_versions: true,
//           },
//         });
//         const result: any = [];
//         data.forEach((master: any) => {
//           if (master.api_versions.length !== 0) {
//             result.push({ id: master.id, name: master.name });
//           }
//         });
//         resolve(result);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getSearchDataBySearchAndCatgory = (search: any, api_type: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let whareClouse = '';
//         let parameters: any = []
//         // $1 %${search}%

//         // $2 
//         if (search && typeof search === 'string' && search.trim() !== '') {
//           whareClouse = `WHERE name ILIKE $1 AND api_version_table.status = 1 AND master_api_table.status = 1 AND default_version = true `;
//           parameters.push(`%${search}%`)
//           if (api_type && typeof api_type === 'string' && ['non commercial transactions', 'commercial transactions', 'lamf', 'e-cas'].includes(api_type)) {
//             whareClouse += `AND api_type::text = $2 `;
//             parameters.push(`${api_type.toLowerCase()}`)
//           } else {
//             whareClouse += `OR api_type::text ILIKE $2 `;
//             parameters.push(`%${search}%`)
//           }
//         }
//         if (whareClouse === '' && api_type && typeof api_type === 'string' && ['non commercial transactions', 'commercial transactions', 'lamf', 'e-cas'].includes(api_type)) {
//           whareClouse = `WHERE api_type::text = $1 AND api_version_table.status = 1 AND master_api_table.status = 1 AND default_version = true `;
//           parameters.push(`${api_type.toLowerCase()}`)
//         }
//         if (whareClouse === '') {
//           whareClouse = ' WHERE default_version = true AND api_version_table.status = 1 AND master_api_table.status = 1 ';
//         }
//         let query = `SELECT master_api_table.id AS master_api_id, api_version_table.id AS api_version_id, name, method, api_type, api_version, api_info, enviroment, api_version_table.created_at, api_version_table.updated_at FROM master_api_table JOIN api_version_table ON api_version_table.api_id = master_api_table.id ${whareClouse}ORDER BY master_api_table.created_at DESC, api_version_table.created_at DESC`;
//         console.log(query, parameters);
//         const apis = await pgConnection.query(query, parameters);
//         resolve(apis);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getApiByVersion = (id: number, api_version: string) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let query = `SELECT master_api_table.id AS master_api_id, api_version_table.id AS api_version_id, name, response_timeout, api_document, api_type, api_version, input, output, enviroment, method, uat_route, api_info FROM master_api_table JOIN api_version_table ON api_version_table.api_id = master_api_table.id WHERE master_api_table.id = ${id} AND api_version = '${api_version}'`;
//         const item = await pgConnection.query(query);
//         resolve(item);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getListOfVersionForMaster = (id: any) => {
//     return new Promise(async (resolve, rejects) => {
//       try {
//         const versionList = await MasterApi.find({ where: { id: id }, relations: { api_versions: true }, select: { id: true, api_versions: { id: true, api_version: true, status: true } } });
//         resolve(versionList[0]);
//       } catch (err) {
//         rejects(err);
//       }
//     });
//   };

//   public getUserCart = (id: number) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let query = `SELECT master_api_table.id as master_api_id, api_version_table.id AS api_version_id, name, method, api_type, api_version, enviroment, api_version_table.api_info, c.created_at, c.updated_at FROM (SELECT * FROM cart_table WHERE user_id = ${id}) AS c JOIN api_version_table ON api_version_table.id = c.api_id JOIN master_api_table ON api_version_table.api_id = master_api_table.id ORDER BY c.created_at DESC`;
//         const item = await pgConnection.query(query);
//         resolve(item);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getUserWishlist = (id: number) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         let query = `SELECT master_api_table.id AS master_api_id, api_version_table.id AS api_version_id, name, method, api_type, api_version, enviroment, api_version_table.api_info, c.created_at, c.updated_at FROM (SELECT * FROM wishlist_table WHERE user_id = ${id}) AS c JOIN api_version_table ON api_version_table.id = c.api_id JOIN master_api_table ON api_version_table.api_id = master_api_table.id ORDER BY c.created_at DESC`;
//         const item = await pgConnection.query(query);
//         resolve(item);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getUserCartItemByApiId = (user_id: any, api_version_id: any, master_api_id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const query = `SELECT * FROM cart_table WHERE user_id = ${user_id} AND api_id = ${api_version_id} and master_api_id = ${master_api_id}`;
//         const items = await pgConnection.query(query);
//         resolve(items);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getUserOrders = (domain_id: any, master_id: any, version_id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const query = `SELECT * FROM uat_api_order_table JOIN users ON users.id = uat_api_order_table.user_id WHERE users.domain = ${domain_id} AND master_api_id = ${master_id} AND api_version_id = ${version_id} ORDER BY uat_api_order_table.updated_by DESC`;
//         const items = await pgConnection.query(query);
//         console.log(items);
//         resolve(items);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getUserCartItems = (user_id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const userCart = await pgConnection.query(`SELECT id, api_id, master_api_id FROM cart_table WHERE user_id = ${user_id}`);
//         resolve(userCart);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public placeOrder = (apiIdObj: any, apiId: any, user_id: any, orderId: any, arn_code: any, ria_code: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const order = UATOrder.create({
//           // api_id: apiIdObj,
//           user_id: user_id,
//           order_id: orderId,
//           arn_code,
//           ria_code,
//         });
//         // await order.save();
//         await Cart.delete({ id: In(apiId), user_id: user_id });
//         resolve(order);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getUserOrderList = (domain_id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const userOrder = await pgConnection.query(
//           `SELECT  master_api_table.id AS master_api_id, api_version_table.id AS api_version_id , name, method, api_type, api_info, enviroment, api_version, users.id AS user_id, order_id, uat_api_order_table.created_at, uat_api_order_table.updated_at,  arn_code, remark, order_state, ria_code FROM uat_api_order_table JOIN users ON users.id = uat_api_order_table.user_id JOIN master_api_table ON uat_api_order_table.master_api_id = master_api_table.id JOIN api_version_table ON uat_api_order_table.api_version_id = api_version_table.id WHERE users.domain = ${domain_id} ORDER BY uat_api_order_table.created_at DESC`
//         );
//         resolve(userOrder);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getApiVerThatInOrder = (apiIdList: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const orderData = await pgConnection.query(
//           `SELECT api_id AS master_api_id, api_version_table.id AS api_version_id, name, method, api_type, api_info, api_version, enviroment FROM api_version_table JOIN master_api_table ON api_version_table.api_id = master_api_table.id WHERE api_version_table.id IN(${apiIdList})`
//         );
//         resolve(orderData);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };

//   public getUserWishlistItem = (user_id: any, master_api_id: any, api_version_id: any) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const wishlistItem = await pgConnection.query(`SELECT * FROM wishlist_table WHERE user_id = ${user_id} AND api_id = ${api_version_id} AND master_api_id = ${master_api_id}`);
//         resolve(wishlistItem);
//       } catch (err) {
//         reject(err);
//       }
//     });
//   };
// }
