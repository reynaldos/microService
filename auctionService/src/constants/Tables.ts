type TableList = {
	AUCTIONS_TABLE: string;
};

const TABLES: TableList = {
	AUCTIONS_TABLE: `${process.env.AUCTIONS_TABLE}`,
};

export { TABLES };
