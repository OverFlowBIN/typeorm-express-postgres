import { getConnection } from '../../database/aplusAsset';
import { Company } from '../../interfaces/enums';

export async function getPlannersInfo(company: Company) {
  const conn = await getConnection(company);

  try {
    if (company === Company.APLUS_ASSET) {
      const { rows } = await conn.execute(
        `
          SELECT
              PE_ID as "plannerId", PE_KNM as "name", HP as "phone", ('APLUS_ASSET') as "company", BON_NM as "headquarter", BRAN_NM as "branch", PE_GB as "position", "영업직책" as "salesPosition", LIFE as "certificateLife", PROP as "certificateProp", VARI as "certificateVari", USE_YN as "active"
          FROM
              "TRD"."V_APLUS_PE"
          ORDER BY
              "plannerId" ASC
        `
      );
      return rows;
    }
    return null;
  } catch (error) {
    throw error;
  } finally {
    await conn.release();
  }
}

export async function getPlannerInfo(company: Company, plannerId: string) {
  const conn = await getConnection(company);

  try {
    if (company === Company.APLUS_ASSET) {
      const { rows } = await conn.execute(
        `
          SELECT
              PE_ID as "plannerId", PE_KNM as "name", HP as "phone", ('APLUS_ASSET') as "company", BON_NM as "headquarter", BRAN_NM as "branch", PE_GB as "position"
          FROM
              "TRD"."V_APLUS_PE"
          WHERE
              PE_GB is not NULL AND HP is not null AND PE_ID = '${plannerId}'
        `
      );
      return rows;
    }
    return [];
  } catch (error) {
    throw error;
  } finally {
    await conn.release();
  }
}
