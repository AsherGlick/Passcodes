// Coding Standard: Unpublishable
// This crap is going to work if it is the last thing I do tonight
// I really miss having a desk that fits me, I dont even know what is going on 'osajgnnd[onea
// Lets go


#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/algorithm/string.hpp>
#include <iostream>
using namespace std;



int main() {
	cout << "Loading the JSON file" << endl;
	using boost::property_tree::ptree;
	ptree pt;

	// Load the JSON into the property tree ometrherfke
	string testfile = "db_schema.json";
	read_json(testfile, pt);

	cout << "JSON file loaded" << endl;



	cout << "Parsing File" << endl;
	for ( ptree::value_type const& v : pt.get_child("")) {

		string columnName = v.first;

		ptree subtree = v.second;
		string type = subtree.get<std::string>("Type"); 
		string size = subtree.get("Size", "");
		string description = subtree.get("Description", "");
		bool isIndex = subtree.get("Index", false);
		string defaultValue = subtree.get("Default", "");
		bool isNullable = subtree.get("Nullable", true);
		string extraData = subtree.get("Extra", "");
		bool isDepricated = subtree.get("Depricated", false);


		cout << "  `" << boost::to_lower_copy(columnName) << "`";
		cout << " " << boost::to_lower_copy(type); if (size.length() > 0) cout << "(" << size << ")"; cout << " ";
		if (!isNullable) cout << "NOT NULL";
		if (extraData.length() > 0) cout << " " << extraData;
		cout << "," << endl;



		// CREATE TABLE `virtual_aliases` (
		//   `id` int(11) NOT NULL auto_increment,
		//   `domain_id` int(11) NOT NULL,
		//   `source` varchar(100) NOT NULL,
		//   `destination` varchar(100) NOT NULL,
		//   PRIMARY KEY (`id`),
		//   FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
		// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	}

}