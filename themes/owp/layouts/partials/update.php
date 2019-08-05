<?php
require_once "$_SERVER[PHPCONF]";
require_once 'lib/Db/C2kDb.php';
require_once 'lib/Online/const.php';
require_once 'lib/Generic/file.php';
require_once 'lib/Generic/SessionManager.php';
require_once 'lib/Online/StoreComponent.php';
require_once 'lib/Online/NewVersion/Ship/Ship.php';
require_once 'lib/Db/Table/Owp/Cart.php';
require_once 'lib/Online/Interface/Cart/AddCourseStudent.php';
require_once 'lib/Online/Page.php';
require_once 'lib/Online/Screen.php';
require_once 'lib/Db/Table/Owp/OperatorLicense.php';
require_once 'lib/Online/Interface/SelfHelp/ContactInformation/Index.php';
require_once 'lib/Db/Table/C2k/Person.php';
require_once 'lib/Db/Table/C2k/Enrollment.php';
require_once 'lib/Db/Table/C2k/Country.php';
require_once 'lib/Generic/Glossary.php';
$page = new Page();
$db = $page->getDb();
$ship = new Ship($db);
$man_fee = 0;
$pac_fee = 0;
$enroll_fee = 0;

if ($_REQUEST['action'] == 'fetchStudentRecords') {
    $obj = json_decode($_POST['param'], false);
    $course = $obj->{'course'};
    $course = json_decode(json_encode($course), true);
    $_SESSION['cartid'] = $course["cartid"];
    $cartitem = new Owp_CartItem($db, $_SESSION['cartid']);
    $result = $cartitem->fetchStudents($_SESSION['cartid']);
    $outputJSON = json_encode($result);
    echo $outputJSON;
}
if ($_REQUEST['action'] == 'cartListing') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['cartid'] = $obj->{'cartid'};
    $cart = new Owp_Cart($db);
    $res = $cart->loadItemsFromDb();
    $students = [];
    $courses = [];
    $temp = [];
    $studenttemp = [];
    $res = msort($res, "owpabbr");
    $cnt = 0;
    $same = 0;
    $temp['sectionid'] = 0;
    for ($i = 0; $i < count($res); $i++) {

        if ((($i - 1) >= 0) && ($res[$i]['owpabbr'] == $res[$i - 1]['owpabbr'])) {
            $same++;

            if (($res[$i]['feedesc'] == 'Manual') || ($res[$i]['feedesc'] == 'Supplemental Learning Booklet')) {
                $courses[$cnt - 1]['manqty'] = $res[$i]['qty'];
                array_push($courses[$cnt - 1]['cartitemid']['manualCiid'], $res[$i]['cartitemid']);
            } else {
                if ($res[$i]['feedesc'] == 'Enrollment') {
                    array_push($courses[$cnt - 1]['cartitemid']['enrollCiid'], $res[$i]['cartitemid']);
                }
                if (($res[$i]['feedesc'] == 'Course Package (Enrollment plus Manual) ') || ($res[$i]['feedesc'] == 'Course Package (Enrollment, 4-DVD Set, and Supplemental Learning Booklet) ')) {

                    array_push($courses[$cnt - 1]['cartitemid']['packageCiid'], $res[$i]['cartitemid']);
                }
                $students = studentObject($res[$i]['cartitemid'], $temp['sectionid'], $res[$i]['firstname'], $res[$i]['lastname'], $res[$i]['feedesc'], "Online", $res[$i]['email'], $res[$i]['ssn4']);
                array_push($courses[$cnt - 1]['studentlist'], $students);
            }
        } else {
            $same = 0;
            $temp['cartid'] = $_SESSION['cartid'];
            $temp['itemname'] = $res[$i]["itemname"];
            $temp['img'] = strtolower($res[$i]["owpabbr"]) . '.' . $res[$i]["imgext"];
            $temp['manqty'] = 0;

            $records_feeid = $ship->FetchFeeId($res[$i]['feeid']);

            foreach ($records_feeid as $row) {
                $temp['sectionid'] = $row["section_id"];
                if ($row['fee_name'] == "Manual") {
                    $temp['manfee'] = $row['amount'];
                    $temp['mfeeid'] = $row['feeid'];
                }
                if ($row['fee_name'] == "Course Package") {
                    $temp['pacfee'] = $row['amount'];
                    $temp['pfeeid'] = $row['feeid'];
                }
                if ($row['fee_name'] == "Enrollment") {
                    $temp['enrollfee'] = $row['amount'];
                    $temp['efeeid'] = $row['feeid'];
                }
            }
            $temp['cartitemid']['manualCiid'] = [];
            $temp['cartitemid']['enrollCiid'] = [];
            $temp['cartitemid']['packageCiid'] = [];
            $temp['studentlist'] = [];
            if ($res[$i]['feedesc'] == 'Manual' || ($res[$i]['feedesc'] == 'Supplemental Learning Booklet')) {
                $temp['manqty'] = $res[$i]['qty'];
                array_push($temp['cartitemid']['manualCiid'], $res[$i]['cartitemid']);
            } else {
                if ($res[$i]['feedesc'] == 'Enrollment') {
                    array_push($temp['cartitemid']['enrollCiid'], $res[$i]['cartitemid']);
                }
                if (($res[$i]['feedesc'] == 'Course Package (Enrollment plus Manual) ') || ($res[$i]['feedesc'] == 'Course Package (Enrollment, 4-DVD Set, and Supplemental Learning Booklet) ')) {
                    array_push($temp['cartitemid']['packageCiid'], $res[$i]['cartitemid']);
                }
                $students = studentObject($res[$i]['cartitemid'], $temp['sectionid'], $res[$i]['firstname'], $res[$i]['lastname'], $res[$i]['feedesc'], "Online", $res[$i]['email'], $res[$i]['ssn4']);
            }
            array_push($temp['studentlist'], $students);
            array_push($courses, $temp);

            $cnt++;
        }
    }
    $outputJSON = json_encode($courses);
    echo $outputJSON;
}
if ($_REQUEST['action'] == 'addItem') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['cartid'] = $obj->{'cartid'};
    $sectionid = $obj->{'sectionid'};

    $courses = [];
    $courses['sectionid'] = $sectionid;
    $courses['cartid'] = $_SESSION['cartid'];
    $courses['img'] = '';
    $courses['itemname'] = '';
    $courses['manqty'] = '';
    $courses['studentlist'] = [];
    $courses['cartitemid'] = [];

    $fee = new C2k_Fee($db);
    $res = $fee->selForCorsec($sectionid);
    foreach ($res as $row) {
        if ($row['feetyp'] == 'Course Package') {
            $courses['pacfee'] = $row['feeamt'];
            $courses['pfeeid'] = $row['feeid'];
        }
        if ($row['feetyp'] == 'Enrollment') {
            $courses['enrollfee'] = $row['feeamt'];
            $courses['efeeid'] = $row['feeid'];
        }
        if ($row['feetyp'] == 'Manual') {
            $courses['manfee'] = $row['feeamt'];
            $courses['mfeeid'] = $row['feeid'];
        }
    }

    $output = array("course" => $courses);
    $outputJSON = json_encode($output);
    echo $outputJSON;

}
if ($_REQUEST['action'] == 'updateEnrollment') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['cartid'] = $obj->{'cartid'};
    $cart = new Owp_Cart($db);
    $course = json_decode(json_encode($obj->{'course'}), true);
    $cartitem = new Owp_CartItem($db, $_SESSION['cartid']);
    $studentlist = $course["studentlist"];
    for ($i = 0; $i < count($studentlist); $i++) {
        if ($studentlist[$i]["cartitemid"] != 0) {
            $res = $cartitem->updStudent($studentlist[$i]["cartitemid"], $studentlist[$i]);
        } else {
            /*          if ($studentlist[$i]["first_name"] == "") {
                      //   $studentlist = array_merge(array_slice($studentlist, 0, $i - 1), array_slice($studentlist, $i + 1, count($studentlist)));
                      } else {
          */
            if ($studentlist[$i]["type"] == "Enrollment") {
                $studentlist[$i]["feeid"] = $course["efeeid"];
                $studentlist[$i]["cartitemid"] = $cartitem->addCourseItem(1, $studentlist[$i]);
                array_push($course["cartitemid"]["enrollCiid"], $studentlist[$i]["cartitemid"]);
            }
            if ($studentlist[$i]["type"] == "Package") {
                $studentlist[$i]["feeid"] = $course['pfeeid'];
                $studentlist[$i]["cartitemid"] = $cartitem->addCourseItem(1, $studentlist[$i]);
                array_push($course["cartitemid"]["packageCiid"], $studentlist[$i]["cartitemid"]);
            }
            //  }
        }
    }

    $course["studentlist"] = $studentlist;
    $output = array("course" => $course);
    $outputJSON = json_encode($output);
    echo $outputJSON;
}
function checkCountry($db, $stateAbbr)
{
    $countryTable = new \C2k_Country($db);
    return $countryTable->selUsOrCanada($stateAbbr);
}

if ($_REQUEST['action'] == 'update-or-add-license') {

    $obj = json_decode($_POST['param'], false);
    $_SESSION['id'] = $obj->{'id'};
    $_SESSION['cartid'] = $obj->{'cartid'};
    $operator = json_decode(json_encode($obj->{'operator'}), true);
    $i = 1;
    $oprlicTbl = new \Owp_OperatorLicense($db);
    $msg = "" . $operator[$i]['oprlicid'] . $operator[$i]['liccatid'] . $operator[$i]['countryid'] . $operator[$i]['stateid'] . $operator[$i]['oprlicstatus'] . $operator[$i]['operatornumber'];
    $flag = true;
    $cnt = 0;
    for ($i = 0; $i < count($operator); $i++) {
        $flag = true;
        $cnt = 0;
        if ($operator[$i]['archivedflag'] != 1) {
            if ($operator[$i]['oprlicid'] != 0) {
                $country = checkCountry($db, $operator[$i]['stateid']);
                if (count($country) === 0) {
                    $msg = $msg . "country";
                    break;
                }
                // Check person does NOT already have a record for this country+state combo
                //$operatorNumbers = $oprlicTbl->selByPersonId($_SESSION['id']);
                //$operatorNumberCount = count($operatorNumbers);
                if ($operator > 0) {
                    $rf = true;
                    $operator = msort($operator, 'stateid');
                    for ($k = 1; $k < count($operator); $k++) {
                        if ($operator[$k]['stateid'] == $operator[$k - 1]['stateid']) {
                            $cnt = 2;
                            break;
                        }
                    }
                }
                if ($cnt != 2) {
                    $msg = $msg . "line inside if i = " . $i . " cnt = " . $cnt;
                    //$msg = $msg . $operator[$i]['oprlicid'] . $operator[$i]['liccatid'] . $operator[$i]['countryid'] . $operator[$i]['stateid'] . $operator[$i]['oprlicstatus'] . $operator[$i]['operatornumber'];
                    $res = $oprlicTbl->upd($operator[$i]['oprlicid'], $operator[$i]['liccatid'], $operator[$i]['countryid'], $operator[$i]['stateid'], $operator[$i]['oprlicstatus'], $operator[$i]['operatornumber']);
                    $operator[$i]['oprlicid'] = $res['id'];
                } else {
                    $msg = $msg . "line inside else i = " . $i . " cnt = " . $cnt;
                    $msg = $msg . "Trying to update 2 operator numbers with same state";
                    break;
                }
            } else if ($operator[$i]['oprlicid'] == 0) {
                // Sabse pehele sirf insert k liywe karo Insert karne se pehele hi apne ko validate karna hai..
                $country = checkCountry($db, $operator[$i]['stateid']);
                if (count($country) === 0) {
                    break;
                }
                // Check person does NOT already have a record for this country+state combo
                $operatorNumbers = $oprlicTbl->selByPersonId($_SESSION['id']);
                $operatorNumberCount = count($operatorNumbers);
                if ($operatorNumberCount > 0) {
                    $rf = true;
                    foreach ($operatorNumbers as $operatorNumber) {
                        if (($operatorNumber['countryid'] == $country['id']) &&
                            ($operatorNumber['stateid'] == $operator[$i]['stateid']) &&
                            ($operatorNumber['liccatid'] == $operator[$i]['liccatid'])
                        ) {
                            $msg = "We already have an operator number on record for the state of" . $operator[$i]['state'];
                            $flag = false;
                            break;
                        }
                    }
                }
                if ($flag == true) {
                    $res = $oprlicTbl->ins($operator[$i]['personid'], $operator[$i]['liccatid'], $operator[$i]['countryid'], $operator[$i]['stateid'], $operator[$i]['oprlicstatus'], $operator[$i]['operatornumber']);
                    $operator[$i]['oprlicid'] = $res['id'];
                } else {
                    $msg = "msg 2";
                    break;
                }
            }
        } else if ($operator[$i]['archivedflag'] == 1 && $operator[$i]['operatornumber'] != '') {
            $oprlicTbl->archiveById($operator[$i]['oprlicid']);
        }
    }
    $opl = loadOperator($db);
    // check the operator license validity from the file php/lib/Online/Interface/SelfHelp/OperatorNumber/Create.php
    $output = array("operatorLicense" => $opl, "msg" => $msg);
    $outputJSON = json_encode($output);
    echo $outputJSON;
}
if ($_REQUEST['action'] == 'deleteCartItem') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['cartid'] = $obj->{'cartid'};
    $cartitemid = $obj->{'cartitemid'};
    $cartitem = new Owp_CartItem($db, $_SESSION['cartid']);
    $delqty = $cartitem->deleteItem_NEW($cartitemid);
    $output = array("delqty" => $delqty);
    $outputJSON = json_encode($output);
    echo $outputJSON;
}
if ($_REQUEST['action'] == 'saveManual') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['cartid'] = $obj->{'cartid'};
    $manQty = intval($obj->{'manqty'});
    $cartItemId = intval($obj->{'cartitemid'});
    $sectionid = intval($obj->{'sectionid'});
    $mfeeid = intval($obj->{'mfeeid'});
    $cartitem = new Owp_CartItem($db, $_SESSION['cartid']);
    $ciid = 0;
    $chgqty = 0;
    if ($cartItemId == 0) {
        if ($manQty > 0) {
            $ciid = $cartitem->addItem($mfeeid, $manQty);
        }
    } else {
        if ($manQty <= 0) {
            $chgqty = $cartitem->deleteItem_NEW($cartItemId);
            $chgqty = (-1) * $chgqty;
        }
        if ($manQty > 0) {
            $chgqty = $cartitem->updateItemQty($cartItemId, $manQty);
        }
    }

    $output = array("cartitemid" => $ciid,
        "chgqty" => $chgqty);

    $outputJSON = json_encode($output);
    echo $outputJSON;
}

if ($_REQUEST['action'] == 'loadInfo') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['id'] = $obj->{'id'};
    $_SESSION['token'] = $obj->{'token'};
    $_SESSION['cartid'] = $obj->{'cartid'};
    $personTbl = new \C2k_Person($db);
    $person = $personTbl->selAddress($_SESSION['id']);
    $opl = loadOperator($db);
    $enroll = loadenroll($db);
    $invoice = loadInvoice($db, $_SESSION['id']);
    $output = array("person" => $person, "operatorLicense" => $opl, "enroll" => $enroll, "invoice_item" => $invoice);
    $outputJSON = json_encode($output);
    echo $outputJSON;
}
function loadInvoice($db, $personId)
{
    $sql = 'EXEC c2k_invoice_item_sel_by_personid ?';
    $res = C2kDb::execMultiRowDQL($db, $sql, array($personId));
    $invoiceArray = [];
    foreach ($res as $row) {
        $temp = [];
        $temp['id'] = $row['id'];
        $temp['amount'] = $row['amount'];
        $temp['invoice_date'] = $row['invoice_date'];
        array_push($invoiceArray, $temp);
    }
    return $invoiceArray;
}

function loadOperator($db)
{
    $operator = new \Owp_OperatorLicense($db);
    $res = $operator->selByPersonId_filterArchive($_SESSION['id']);
    $opl = [];
    $temp = [];
    foreach ($res as $row) {
        $temp['oprlicid'] = $row['oprlicid'];
        $temp['personid'] = $row['personid'];
        $temp['liccatid'] = $row['liccatid'];
        $temp['countryid'] = $row['countryid'];
        $temp['oprlicstatus'] = $row['oprlicstatus'];
        $temp['operatornumber'] = $row['operatornumber'];
        $temp['country'] = $row['country'];
        $temp['stateid'] = $row['stateid'];
        $temp['state'] = $row['state'];
        $temp['liccattxt'] = $row['liccattxt'];
        $temp['expiredate'] = $row['expiredate'];
        $temp['expired'] = $row['expired'];
        $temp['expiredflag'] = $row['expiredflag'];
        $temp['archivedflag'] = $row['archivedflag'];
        $temp['archiveddate'] = $row['archiveddate'];
        $temp['insdate'] = $row['insdate'];
        $temp['renewaleligibledate'] = $row['renewaleligibledate'];
        array_push($opl, $temp);
    }
    return $opl;
}

function loadenroll($db)
{
    $enrollments = new \C2k_Enrollment($db);
    $res = $enrollments->selByPerson($_SESSION['id']);
    $enroll = [];
    $i = 0;
    foreach ($res as $row) {
        $enroll[$i] = [];
        $enroll[$i]['ceu'] = $row['ceu'];
        $enroll[$i]['completedate'] = $row['completedate'];
        $enroll[$i]['contacthour'] = $row['contacthour'];

        $enroll[$i]['coursearea'] = $row['coursearea'];
        $enroll[$i]['creditawarded'] = $row['creditawarded'];
        $enroll[$i]['dropdate'] = $row['dropdate'];

        $enroll[$i]['editionnum'] = $row['editionnum'];
        $enroll[$i]['effectiveenrolldate'] = $row['effectiveenrolldate'];
        $enroll[$i]['enrolldate'] = $row['enrolldate'];

        $enroll[$i]['enrollid'] = $row['enrollid'];
        $enroll[$i]['expiredate'] = $row['expiredate'];
        $enroll[$i]['grade'] = $row['grade'];

        $enroll[$i]['gradeid'] = $row['gradeid'];
        $enroll[$i]['haslessonnameflag'] = $row['haslessonnameflag'];
        $enroll[$i]['onlineflag'] = $row['onlineflag'];

        $enroll[$i]['owpabbr'] = $row['owpabbr'];
        $enroll[$i]['reason'] = $row['reason'];
        $enroll[$i]['sectionid'] = $row['sectionid'];

        $enroll[$i]['statusid'] = $row['statusid'];
        $enroll[$i]['statustxt'] = $row['statustxt'];
        $enroll[$i]['title'] = $row['title'];

        $i++;
    }

    return $enroll;

}

if ($_REQUEST['action'] == 'deleteOperator') {
    $obj = json_decode($_POST['param'], false);
    $oprlicId = intval($obj->{'oprlicId'});
    $_SESSION['id'] = $obj->{'personid'};
    $oprlicTbl = new \Owp_OperatorLicense($db);
    $oprlicTbl->archiveById($oprlicId);
    $opl = loadOperator($db);
    $output = array("operatorLicense" => $opl);
    $outputJSON = json_encode($output);
    echo $outputJSON;
}

if ($_REQUEST['action'] == 'loadChapter') {
    $obj = json_decode($_POST['param'], false);
    $enrollid = $obj->{'enrollid'};
    $personTbl = new \C2k_Enrollment($db);
    $res = $personTbl->selExams($enrollid);
    $exam = [];
    $examlist = [];
    for ($i = 0; $i < count($res); $i++) {
        $exam['enrollid'] = $enrollid;
        $exam['ordinal'] = $res[$i]['ordinal'];
        $exam['examname'] = $res[$i]['examname'];
        $exam['gradedate'] = $res[$i]['gradedate'];
        $exam['grade'] = $res[$i]['grade'];
        $exam['maxscore'] = $res[$i]['maxscore'];
        $exam['pct'] = $res[$i]['pct'];
        $examlist[$i] = $exam;
    }

    $output = array("examlist" => $examlist);
    $outputJSON = json_encode($output);
    echo $outputJSON;
}

if ($_REQUEST['action'] == 'updateProfile') {
    $obj = json_decode($_POST['param'], false);
    $_SESSION['id'] = $obj->{'id'};
    $_SESSION['cartid'] = $obj->{'cartid'};
    $person = $obj->{'person'};
    $person = json_decode(json_encode($person), true);
    $operator = $obj->{'operator'};
    $personTbl = new C2k_Person($db);
    $personUpd['personid'] = $_SESSION['id'];
    $personUpd['firstname'] = $person['firstname'];
    $personUpd['lastname'] = $person['lastname'];
    $personUpd['email'] = $person['prfdemailval'];
    $personUpd['phonecountryid'] = $person['hmphncountryid'];
    $personUpd['phoneareacode'] = $person['hmphncity'];
    $personUpd['phonelocal'] = $person['hmphnlocal'];
    $check = $personTbl->updCoreContact($personUpd);
    //$personUpd['personid'] = $_SESSION['id'];
    $personUpd['street1'] = $person['hmstreet1'];
    $personUpd['street2'] = $person['hmstreet2'];
    $personUpd['street3'] = $person['hmstreet3'];
    $personUpd['city'] = $person['hmcity'];
    $personUpd['state'] = $person['hmstate'];
    $personUpd['zip'] = $person['hmzip'];
    $personUpd['countryid'] = $person['hmcountryid'];
    $personUpd['phncountryid'] = $person['hmphncountryid'];
    $personUpd['phncity'] = $person['hmphncity'];
    $personUpd['phnlocal'] = $person['hmphnlocal'];
    $personUpd['phnext'] = $person['hmphnext'];
    $personUpd['faxcountryid'] = $person['hmfaxcountryid'];
    $personUpd['faxcity'] = $person['hmfaxcity'];
    $personUpd['faxlocal'] = $person['hmfaxlocal'];

    $person = $personTbl->updHomeContact($personUpd);
    var_dump($person);
    // javascript k array me bhi update kar na hoga
}
if ($_REQUEST['action'] == 'getTermLists') {

    $obj = json_decode($_POST['param'], false);
    $glossary = new \Glossary($db);
    $res = $glossary->getTermList($obj->{'firstLetter'}, MODULE_OWPSITE);
    echo $res;

}

if ($_REQUEST['action'] == 'getRandomLists') {

    $obj = json_decode($_POST['param'], false);
    $glossary = new \Glossary($db);
    $res = $glossary->getRandom(5);
    echo $res;
}

if ($_REQUEST['action'] == 'getAllGlossaryTerms') {
    $glossary = new \Glossary($db);
    $res = $glossary->getAllGlossaryTerm();
    $output = [];
    $outputList = [];
    for ($i = 0; $i < count($res); $i++) {
        $output['id'] = $res[$i]['id'];
        $output['filename'] = $res[$i]['filename'];
        $output['first_letter'] = $res[$i]['term'][0];
        $output['term'] = $res[$i]['term'];
        $outputList[$i] = $output;
    }
    $output = array("glossaryList" => $outputList);
    $outputJSON = json_encode($output);
    echo $outputJSON;

    //echo $res[0]['term'];
}

function msort($array, $id = "id")
{
    $temp_array = array();
    while (count($array) > 0) {
        $lowest_id = 0;
        $index = 0;
        foreach ($array as $item) {
            if ($item[$id] < $array[$lowest_id][$id]) {
                $lowest_id = $index;
            }
            $index++;
        }
        $temp_array[] = $array[$lowest_id];
        $array = array_merge(array_slice($array, 0, $lowest_id), array_slice($array, $lowest_id + 1));
    }
    return $temp_array;
}

function studentObject($cartitemid, $objectid, $firstname, $lastname, $feedesc, $exam_type, $email, $ssn4)
{
    if ($feedesc == 'Course Package(Enrollment plus Manual) ' || ($feedesc == 'Course Package(Enrollment, 4 - DVD Set, and Supplemental Learning Booklet) ')) {
        $feedesc = 'Package';
    }
    return array('cartitemid' => $cartitemid, 'sectionid' => $objectid,
        'first_name' => $firstname, 'last_name' => $lastname, 'type' => $feedesc,
        'examtype' => $exam_type, 'email' => $email, 'ssn4' => $ssn4);
}

?>