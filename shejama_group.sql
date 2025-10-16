-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 11, 2025 at 12:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shejama_group`
--

-- --------------------------------------------------------

--
-- Table structure for table `accept_orders`
--

CREATE TABLE `accept_orders` (
  `ao_ID` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `I_Id` varchar(25) DEFAULT NULL,
  `itemReceived` varchar(25) DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `accountnumbers`
--

CREATE TABLE `accountnumbers` (
  `acnID` int(11) NOT NULL,
  `sbID` int(11) DEFAULT NULL,
  `number` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booked_item`
--

CREATE TABLE `booked_item` (
  `bi_ID` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `I_Id` varchar(25) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `canceled_orders`
--

CREATE TABLE `canceled_orders` (
  `cid` int(11) NOT NULL,
  `OrID` varchar(25) DEFAULT NULL,
  `detail` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cash_balance`
--

CREATE TABLE `cash_balance` (
  `Id` int(11) NOT NULL,
  `reason` varchar(45) DEFAULT NULL,
  `ref` varchar(25) DEFAULT NULL,
  `ref_type` enum('order','advance','loss','other','supplier','Loan','hire','Deposit','Withdrawl') NOT NULL DEFAULT 'other',
  `dateTime` datetime DEFAULT NULL,
  `amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `Ca_Id` varchar(15) NOT NULL,
  `name` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courier_pass`
--

CREATE TABLE `courier_pass` (
  `cpId` int(11) NOT NULL,
  `handOverDate` date DEFAULT NULL,
  `courier` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courier_pass_order`
--

CREATE TABLE `courier_pass_order` (
  `Id` int(11) NOT NULL,
  `cpId` int(11) DEFAULT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `courierDate` date DEFAULT NULL,
  `trackingNum` varchar(25) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courier_services`
--

CREATE TABLE `courier_services` (
  `Id` int(11) NOT NULL,
  `ser_name` varchar(25) DEFAULT NULL,
  `contact` varchar(12) DEFAULT NULL,
  `othercontact` varchar(12) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `c_ID` varchar(15) NOT NULL,
  `title` varchar(10) DEFAULT NULL,
  `FtName` text DEFAULT NULL,
  `SrName` text DEFAULT NULL,
  `id` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact1` varchar(10) DEFAULT NULL,
  `contact2` varchar(10) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `category` varchar(15) DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `t_name` text DEFAULT NULL,
  `occupation` text DEFAULT NULL,
  `workPlace` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_log`
--

CREATE TABLE `customer_log` (
  `name` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `password` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `damage_item`
--

CREATE TABLE `damage_item` (
  `diID` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `pid_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery`
--

CREATE TABLE `delivery` (
  `dv_id` varchar(25) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(25) NOT NULL,
  `c_ID` varchar(15) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `schedule_Date` date DEFAULT NULL,
  `delivery_Date` date DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `devID` varchar(15) DEFAULT NULL,
  `driverBalance` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_note`
--

CREATE TABLE `delivery_note` (
  `delNoID` int(11) NOT NULL,
  `driverName` varchar(25) DEFAULT NULL,
  `devID` varchar(25) DEFAULT NULL,
  `vehicalName` varchar(25) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `hire` double DEFAULT NULL,
  `district` varchar(35) DEFAULT NULL,
  `balanceToCollect` double DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_note_orders`
--

CREATE TABLE `delivery_note_orders` (
  `delNoID` int(11) NOT NULL,
  `orID` varchar(25) NOT NULL,
  `balance` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_schedule`
--

CREATE TABLE `delivery_schedule` (
  `id` int(11) NOT NULL,
  `ds_date` date DEFAULT NULL,
  `district` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_target_bonus`
--

CREATE TABLE `delivery_target_bonus` (
  `id` int(11) NOT NULL,
  `targetRate` double DEFAULT NULL,
  `bonus` double DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deli_rates`
--

CREATE TABLE `deli_rates` (
  `district` varchar(25) NOT NULL,
  `amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deposit_withdrawals`
--

CREATE TABLE `deposit_withdrawals` (
  `dwID` int(11) NOT NULL,
  `acnID` int(11) DEFAULT NULL,
  `type` enum('Deposit','Withdrawal') DEFAULT 'Deposit',
  `amount` double DEFAULT NULL,
  `dwdate` date DEFAULT NULL,
  `remark` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE `driver` (
  `devID` varchar(25) NOT NULL,
  `E_ID` varchar(15) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `dailyTarget` double NOT NULL DEFAULT 0,
  `monthlyTarget` double NOT NULL DEFAULT 0,
  `lincense` longblob DEFAULT NULL,
  `lincenseDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `driver_dept`
--

CREATE TABLE `driver_dept` (
  `devID` varchar(25) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `month` varchar(15) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `E_Id` varchar(15) NOT NULL,
  `name` text DEFAULT NULL,
  `address` text DEFAULT NULL,
  `nic` varchar(12) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `contact` varchar(15) DEFAULT NULL,
  `job` varchar(15) DEFAULT NULL,
  `basic` double DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emp_leaves`
--

CREATE TABLE `emp_leaves` (
  `id` int(11) NOT NULL,
  `E_Id` varchar(25) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `leave_type` varchar(20) DEFAULT NULL,
  `duration_type` varchar(10) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `present` enum('In','Out','','') NOT NULL DEFAULT 'Out'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gatepass`
--

CREATE TABLE `gatepass` (
  `gatepassID` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `vehicalNum` varchar(25) DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gatepass_details`
--

CREATE TABLE `gatepass_details` (
  `g_p_dID` int(11) NOT NULL,
  `gatepassID` int(11) DEFAULT NULL,
  `pid_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `handover_cheque`
--

CREATE TABLE `handover_cheque` (
  `hcID` int(11) NOT NULL,
  `chequeNumber` text DEFAULT NULL,
  `givenName` text DEFAULT NULL,
  `givenDate` date DEFAULT NULL,
  `purpose` text DEFAULT NULL,
  `type` enum('Handover','Return') DEFAULT 'Handover'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `issued_items`
--

CREATE TABLE `issued_items` (
  `delNoID` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `pid_Id` int(11) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `I_Id` varchar(25) NOT NULL,
  `I_name` text DEFAULT NULL,
  `descrip` text DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `material` varchar(20) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `warrantyPeriod` varchar(25) DEFAULT NULL,
  `stockQty` int(11) DEFAULT NULL,
  `bookedQty` int(11) DEFAULT NULL,
  `damageQty` int(11) DEFAULT NULL,
  `reservedQty` int(11) DEFAULT NULL,
  `dispatchedQty` int(11) DEFAULT NULL,
  `availableQty` int(11) DEFAULT NULL,
  `minQTY` int(11) DEFAULT NULL,
  `mn_Cat` varchar(35) DEFAULT NULL,
  `sb_catOne` varchar(35) DEFAULT NULL,
  `sb_catTwo` varchar(35) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_supplier`
--

CREATE TABLE `item_supplier` (
  `I_Id` varchar(25) NOT NULL,
  `s_ID` varchar(25) NOT NULL,
  `unit_cost` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrID` varchar(25) NOT NULL,
  `orDate` date DEFAULT NULL,
  `c_ID` varchar(15) DEFAULT NULL,
  `orStatus` varchar(15) DEFAULT NULL,
  `delStatus` varchar(10) DEFAULT NULL,
  `delPrice` double DEFAULT NULL,
  `couponeDiscount` double DEFAULT 0,
  `itemDiscount` double DEFAULT 0,
  `specialDiscount` double DEFAULT 0,
  `netTotal` double DEFAULT NULL,
  `total` double DEFAULT NULL,
  `advance` double DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `payStatus` varchar(20) DEFAULT NULL,
  `stID` varchar(25) DEFAULT NULL,
  `expectedDate` date DEFAULT NULL,
  `specialNote` text DEFAULT NULL,
  `ordertype` varchar(10) DEFAULT NULL,
  `billNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_coupon`
--

CREATE TABLE `order_coupon` (
  `ocID` varchar(25) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `cpID` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(11) NOT NULL,
  `orID` varchar(25) NOT NULL,
  `I_Id` varchar(25) NOT NULL,
  `qty` int(11) DEFAULT NULL,
  `tprice` double NOT NULL DEFAULT 0,
  `discount` double DEFAULT NULL,
  `material` varchar(20) NOT NULL,
  `status` varchar(25) DEFAULT 'Not Reserved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_payment`
--

CREATE TABLE `order_payment` (
  `op_ID` varchar(25) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `netTotal` double DEFAULT NULL,
  `or_status` varchar(25) DEFAULT NULL,
  `stID` varchar(25) DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL,
  `otherCharges` double NOT NULL DEFAULT 0,
  `fullPaidAmount` double NOT NULL DEFAULT 0,
  `issuable` enum('Now','Later') NOT NULL DEFAULT 'Now',
  `c_ID` varchar(15) DEFAULT NULL,
  `balance` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_target_bonus`
--

CREATE TABLE `order_target_bonus` (
  `id` int(11) NOT NULL,
  `targetRate` double DEFAULT NULL,
  `bonus` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ords_card_pay`
--

CREATE TABLE `ords_card_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `type` varchar(25) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `intrestValue` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ords_cash_pay`
--

CREATE TABLE `ords_cash_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ords_cheque_pay`
--

CREATE TABLE `ords_cheque_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `bank` varchar(100) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `accountNumber` varchar(50) DEFAULT NULL,
  `chequeNumber` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('received','cashed','returned','handover') DEFAULT 'received'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ords_credit_pay`
--

CREATE TABLE `ords_credit_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `c_ID` varchar(15) DEFAULT NULL,
  `expectedDate` date DEFAULT NULL,
  `balance` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ords_pay_type`
--

CREATE TABLE `ords_pay_type` (
  `optId` int(11) NOT NULL,
  `type` varchar(25) DEFAULT NULL,
  `subType` varchar(25) DEFAULT NULL,
  `payDate` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ords_transfer_pay`
--

CREATE TABLE `ords_transfer_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `bank` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_card_pay`
--

CREATE TABLE `ord_card_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `type` varchar(25) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `intrestValue` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_cash_pay`
--

CREATE TABLE `ord_cash_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_cheque_pay`
--

CREATE TABLE `ord_cheque_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `bank` text DEFAULT NULL,
  `branch` text DEFAULT NULL,
  `accountNumber` int(11) DEFAULT NULL,
  `chequeNumber` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('received','cashed','returned','handover') DEFAULT 'received'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_courier`
--

CREATE TABLE `ord_courier` (
  `Id` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `expectedDate` date DEFAULT NULL,
  `charge` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_credit_pay`
--

CREATE TABLE `ord_credit_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `c_ID` varchar(15) DEFAULT NULL,
  `expectedDate` date DEFAULT NULL,
  `balance` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_pay_type`
--

CREATE TABLE `ord_pay_type` (
  `optId` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `type` varchar(25) DEFAULT NULL,
  `subType` varchar(25) DEFAULT NULL,
  `payDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ord_transfer_pay`
--

CREATE TABLE `ord_transfer_pay` (
  `id` int(11) NOT NULL,
  `optId` int(11) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `acnID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otherhire`
--

CREATE TABLE `otherhire` (
  `id` int(11) NOT NULL,
  `customer` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `bookingDate` date DEFAULT NULL,
  `pickup` text DEFAULT NULL,
  `destination` text DEFAULT NULL,
  `distance` int(11) DEFAULT NULL,
  `hire` double DEFAULT NULL,
  `driverId` varchar(25) DEFAULT NULL,
  `vehicleID` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `payment` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pay_type_orders`
--

CREATE TABLE `pay_type_orders` (
  `optId` int(11) NOT NULL,
  `orID` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pay_type_purchases`
--

CREATE TABLE `pay_type_purchases` (
  `pptId` int(11) DEFAULT NULL,
  `pc_Id` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

CREATE TABLE `production` (
  `p_ID` varchar(25) NOT NULL,
  `I_Id` varchar(25) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `s_ID` varchar(25) DEFAULT NULL,
  `expectedDate` date DEFAULT NULL,
  `specialNote` text DEFAULT NULL,
  `status` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `img` longblob NOT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `pc_Id` varchar(25) NOT NULL,
  `s_ID` varchar(25) NOT NULL,
  `rDate` date NOT NULL,
  `total` double DEFAULT NULL,
  `pay` double DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `deliveryCharge` double DEFAULT NULL,
  `invoiceId` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_detail`
--

CREATE TABLE `purchase_detail` (
  `psd_ID` int(11) NOT NULL,
  `pc_Id` varchar(25) NOT NULL,
  `I_Id` varchar(25) NOT NULL,
  `rec_count` int(11) DEFAULT NULL,
  `unitPrice` double DEFAULT NULL,
  `total` double DEFAULT NULL,
  `stock_range` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_payment`
--

CREATE TABLE `purchase_payment` (
  `pp_ID` varchar(25) NOT NULL,
  `pc_Id` varchar(25) DEFAULT NULL,
  `s_ID` varchar(25) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_pay_type`
--

CREATE TABLE `purchase_pay_type` (
  `pptId` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `subType` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `p_i_detail`
--

CREATE TABLE `p_i_detail` (
  `pid_Id` int(11) NOT NULL,
  `pc_Id` varchar(25) NOT NULL,
  `I_Id` varchar(25) NOT NULL,
  `stock_Id` varchar(25) NOT NULL,
  `barcode_img` longblob NOT NULL,
  `status` varchar(15) DEFAULT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `material` varchar(20) NOT NULL,
  `price` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recepitlog`
--

CREATE TABLE `recepitlog` (
  `Repid` int(11) NOT NULL,
  `repdate` datetime DEFAULT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `repType` varchar(15) DEFAULT NULL,
  `chashier` varchar(25) DEFAULT NULL,
  `repstatus` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `id` int(11) NOT NULL,
  `E_Id` varchar(25) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `return_orders`
--

CREATE TABLE `return_orders` (
  `rid` int(11) NOT NULL,
  `OrID` varchar(25) DEFAULT NULL,
  `detail` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_advance`
--

CREATE TABLE `salary_advance` (
  `ad_ID` varchar(25) NOT NULL,
  `E_Id` varchar(25) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_loan`
--

CREATE TABLE `salary_loan` (
  `sl_ID` varchar(25) NOT NULL,
  `E_Id` varchar(25) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `installment` double DEFAULT NULL,
  `months` int(11) DEFAULT NULL,
  `skip` int(11) DEFAULT NULL,
  `dateTime` datetime DEFAULT NULL,
  `status` enum('Finished','Unfinished') NOT NULL DEFAULT 'Unfinished'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_coupon`
--

CREATE TABLE `sales_coupon` (
  `cpID` varchar(25) NOT NULL,
  `stID` varchar(25) DEFAULT NULL,
  `discount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_team`
--

CREATE TABLE `sales_team` (
  `stID` varchar(25) NOT NULL,
  `E_Id` varchar(15) DEFAULT NULL,
  `orderTarget` double DEFAULT NULL,
  `issuedTarget` double DEFAULT NULL,
  `totalOrder` double DEFAULT NULL,
  `totalIssued` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sale_target`
--

CREATE TABLE `sale_target` (
  `id` int(11) NOT NULL,
  `targetType` text DEFAULT NULL,
  `bonus` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sal_loan_detail`
--

CREATE TABLE `sal_loan_detail` (
  `Id` int(11) NOT NULL,
  `sl_ID` varchar(25) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `installment` double DEFAULT NULL,
  `status` enum('Paid','Unpaid') NOT NULL DEFAULT 'Unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessionlogs`
--

CREATE TABLE `sessionlogs` (
  `SessionID` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `LoginTime` datetime DEFAULT current_timestamp(),
  `LogoutTime` datetime DEFAULT NULL,
  `Token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shop_banks`
--

CREATE TABLE `shop_banks` (
  `sbID` int(11) NOT NULL,
  `Bank` text DEFAULT NULL,
  `branch` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `special_reservation`
--

CREATE TABLE `special_reservation` (
  `srID` int(11) NOT NULL,
  `orID` varchar(25) DEFAULT NULL,
  `pid_Id` int(11) DEFAULT NULL,
  `orderDetailId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `st_order_review`
--

CREATE TABLE `st_order_review` (
  `stID` varchar(25) NOT NULL,
  `year` int(11) NOT NULL,
  `month` varchar(15) NOT NULL,
  `totalOrder` double DEFAULT NULL,
  `totalIssued` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcat_one`
--

CREATE TABLE `subcat_one` (
  `sb_c_id` varchar(15) NOT NULL,
  `subcategory` text DEFAULT NULL,
  `Ca_Id` varchar(15) DEFAULT NULL,
  `img` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcat_two`
--

CREATE TABLE `subcat_two` (
  `sb_cc_id` varchar(15) NOT NULL,
  `subcategory` text DEFAULT NULL,
  `sb_c_id` varchar(15) DEFAULT NULL,
  `img` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `s_ID` varchar(25) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact` varchar(10) DEFAULT NULL,
  `contact2` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `contact` varchar(10) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `E_Id` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL,
  `registration_no` varchar(25) DEFAULT NULL,
  `brand` varchar(25) DEFAULT NULL,
  `model` varchar(25) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `license_Date` date DEFAULT NULL,
  `insurance_Date` date DEFAULT NULL,
  `fuel_type` varchar(25) DEFAULT NULL,
  `size` varchar(25) DEFAULT NULL,
  `status` enum('Active','Inactive','Sold') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accept_orders`
--
ALTER TABLE `accept_orders`
  ADD PRIMARY KEY (`ao_ID`),
  ADD KEY `FK_accept_orders_orID` (`orID`),
  ADD KEY `I_Id` (`I_Id`);

--
-- Indexes for table `accountnumbers`
--
ALTER TABLE `accountnumbers`
  ADD PRIMARY KEY (`acnID`),
  ADD KEY `sbID` (`sbID`);

--
-- Indexes for table `booked_item`
--
ALTER TABLE `booked_item`
  ADD PRIMARY KEY (`bi_ID`),
  ADD KEY `orID` (`orID`),
  ADD KEY `I_Id` (`I_Id`);

--
-- Indexes for table `canceled_orders`
--
ALTER TABLE `canceled_orders`
  ADD PRIMARY KEY (`cid`),
  ADD KEY `OrID` (`OrID`);

--
-- Indexes for table `cash_balance`
--
ALTER TABLE `cash_balance`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`Ca_Id`);

--
-- Indexes for table `courier_pass`
--
ALTER TABLE `courier_pass`
  ADD PRIMARY KEY (`cpId`),
  ADD KEY `fk_courier_pass` (`courier`);

--
-- Indexes for table `courier_pass_order`
--
ALTER TABLE `courier_pass_order`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `fk_courier_pass_order_orID` (`orID`),
  ADD KEY `fk_courier_pass_order_cpId` (`cpId`);

--
-- Indexes for table `courier_services`
--
ALTER TABLE `courier_services`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`c_ID`);

--
-- Indexes for table `damage_item`
--
ALTER TABLE `damage_item`
  ADD PRIMARY KEY (`diID`),
  ADD KEY `orID` (`orID`),
  ADD KEY `pid_Id` (`pid_Id`);

--
-- Indexes for table `delivery`
--
ALTER TABLE `delivery`
  ADD PRIMARY KEY (`dv_id`),
  ADD KEY `orID` (`orID`),
  ADD KEY `c_ID` (`c_ID`),
  ADD KEY `devID` (`devID`);

--
-- Indexes for table `delivery_note`
--
ALTER TABLE `delivery_note`
  ADD PRIMARY KEY (`delNoID`),
  ADD KEY `devID` (`devID`);

--
-- Indexes for table `delivery_note_orders`
--
ALTER TABLE `delivery_note_orders`
  ADD PRIMARY KEY (`delNoID`,`orID`),
  ADD KEY `orID` (`orID`);

--
-- Indexes for table `delivery_schedule`
--
ALTER TABLE `delivery_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `delivery_target_bonus`
--
ALTER TABLE `delivery_target_bonus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deli_rates`
--
ALTER TABLE `deli_rates`
  ADD PRIMARY KEY (`district`);

--
-- Indexes for table `deposit_withdrawals`
--
ALTER TABLE `deposit_withdrawals`
  ADD PRIMARY KEY (`dwID`),
  ADD KEY `acnID` (`acnID`);

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`devID`);

--
-- Indexes for table `driver_dept`
--
ALTER TABLE `driver_dept`
  ADD KEY `devID` (`devID`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`E_Id`);

--
-- Indexes for table `emp_leaves`
--
ALTER TABLE `emp_leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `E_Id` (`E_Id`);

--
-- Indexes for table `gatepass`
--
ALTER TABLE `gatepass`
  ADD PRIMARY KEY (`gatepassID`),
  ADD KEY `orID` (`orID`);

--
-- Indexes for table `gatepass_details`
--
ALTER TABLE `gatepass_details`
  ADD PRIMARY KEY (`g_p_dID`),
  ADD KEY `gatepassID` (`gatepassID`),
  ADD KEY `pid_Id` (`pid_Id`);

--
-- Indexes for table `handover_cheque`
--
ALTER TABLE `handover_cheque`
  ADD PRIMARY KEY (`hcID`);

--
-- Indexes for table `issued_items`
--
ALTER TABLE `issued_items`
  ADD PRIMARY KEY (`delNoID`),
  ADD KEY `orID` (`orID`),
  ADD KEY `pid_Id` (`pid_Id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`I_Id`);

--
-- Indexes for table `item_supplier`
--
ALTER TABLE `item_supplier`
  ADD PRIMARY KEY (`I_Id`,`s_ID`),
  ADD KEY `s_ID` (`s_ID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrID`),
  ADD KEY `stID` (`stID`),
  ADD KEY `c_ID` (`c_ID`);

--
-- Indexes for table `order_coupon`
--
ALTER TABLE `order_coupon`
  ADD PRIMARY KEY (`ocID`),
  ADD KEY `orID` (`orID`),
  ADD KEY `cpID` (`cpID`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `I_Id` (`I_Id`);

--
-- Indexes for table `order_payment`
--
ALTER TABLE `order_payment`
  ADD PRIMARY KEY (`op_ID`),
  ADD KEY `stID` (`stID`),
  ADD KEY `orID` (`orID`),
  ADD KEY `fk_order_customer` (`c_ID`);

--
-- Indexes for table `order_target_bonus`
--
ALTER TABLE `order_target_bonus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ords_card_pay`
--
ALTER TABLE `ords_card_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ords_card_pay_ibfk_1` (`optId`);

--
-- Indexes for table `ords_cash_pay`
--
ALTER TABLE `ords_cash_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `optId` (`optId`);

--
-- Indexes for table `ords_cheque_pay`
--
ALTER TABLE `ords_cheque_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ords_cheque_pay_ibfk_1` (`optId`);

--
-- Indexes for table `ords_credit_pay`
--
ALTER TABLE `ords_credit_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `c_ID` (`c_ID`),
  ADD KEY `ords_credit_pay_ibfk_1` (`optId`);

--
-- Indexes for table `ords_pay_type`
--
ALTER TABLE `ords_pay_type`
  ADD PRIMARY KEY (`optId`);

--
-- Indexes for table `ords_transfer_pay`
--
ALTER TABLE `ords_transfer_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `optId` (`optId`);

--
-- Indexes for table `ord_card_pay`
--
ALTER TABLE `ord_card_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `optId` (`optId`);

--
-- Indexes for table `ord_cash_pay`
--
ALTER TABLE `ord_cash_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `optId` (`optId`);

--
-- Indexes for table `ord_cheque_pay`
--
ALTER TABLE `ord_cheque_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `optId` (`optId`);

--
-- Indexes for table `ord_courier`
--
ALTER TABLE `ord_courier`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `fk_ord_courier_orders` (`orID`);

--
-- Indexes for table `ord_credit_pay`
--
ALTER TABLE `ord_credit_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `c_ID` (`c_ID`),
  ADD KEY `optId` (`optId`);

--
-- Indexes for table `ord_pay_type`
--
ALTER TABLE `ord_pay_type`
  ADD PRIMARY KEY (`optId`),
  ADD KEY `orID` (`orID`);

--
-- Indexes for table `ord_transfer_pay`
--
ALTER TABLE `ord_transfer_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `optId` (`optId`),
  ADD KEY `fk_ord_transfer_account` (`acnID`);

--
-- Indexes for table `otherhire`
--
ALTER TABLE `otherhire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer` (`customer`),
  ADD KEY `vehicleID` (`vehicleID`),
  ADD KEY `driverId` (`driverId`);

--
-- Indexes for table `pay_type_orders`
--
ALTER TABLE `pay_type_orders`
  ADD PRIMARY KEY (`optId`,`orID`),
  ADD KEY `fk_order` (`orID`);

--
-- Indexes for table `pay_type_purchases`
--
ALTER TABLE `pay_type_purchases`
  ADD KEY `pptId` (`pptId`),
  ADD KEY `pc_Id` (`pc_Id`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`p_ID`),
  ADD KEY `I_Id` (`I_Id`),
  ADD KEY `s_ID` (`s_ID`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`pc_Id`),
  ADD KEY `s_ID` (`s_ID`);

--
-- Indexes for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  ADD PRIMARY KEY (`psd_ID`),
  ADD KEY `pc_Id` (`pc_Id`),
  ADD KEY `I_Id` (`I_Id`);

--
-- Indexes for table `purchase_payment`
--
ALTER TABLE `purchase_payment`
  ADD PRIMARY KEY (`pp_ID`),
  ADD KEY `pc_Id` (`pc_Id`),
  ADD KEY `s_ID` (`s_ID`);

--
-- Indexes for table `purchase_pay_type`
--
ALTER TABLE `purchase_pay_type`
  ADD PRIMARY KEY (`pptId`);

--
-- Indexes for table `p_i_detail`
--
ALTER TABLE `p_i_detail`
  ADD PRIMARY KEY (`pid_Id`),
  ADD KEY `I_Id` (`I_Id`),
  ADD KEY `pc_Id` (`pc_Id`);

--
-- Indexes for table `recepitlog`
--
ALTER TABLE `recepitlog`
  ADD PRIMARY KEY (`Repid`),
  ADD KEY `chashier` (`chashier`),
  ADD KEY `orID` (`orID`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `E_Id` (`E_Id`);

--
-- Indexes for table `return_orders`
--
ALTER TABLE `return_orders`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `OrID` (`OrID`);

--
-- Indexes for table `salary_advance`
--
ALTER TABLE `salary_advance`
  ADD PRIMARY KEY (`ad_ID`),
  ADD KEY `E_Id` (`E_Id`);

--
-- Indexes for table `salary_loan`
--
ALTER TABLE `salary_loan`
  ADD PRIMARY KEY (`sl_ID`),
  ADD KEY `E_Id` (`E_Id`);

--
-- Indexes for table `sales_coupon`
--
ALTER TABLE `sales_coupon`
  ADD PRIMARY KEY (`cpID`),
  ADD KEY `stID` (`stID`);

--
-- Indexes for table `sales_team`
--
ALTER TABLE `sales_team`
  ADD PRIMARY KEY (`stID`),
  ADD KEY `E_Id` (`E_Id`);

--
-- Indexes for table `sale_target`
--
ALTER TABLE `sale_target`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sal_loan_detail`
--
ALTER TABLE `sal_loan_detail`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `sl_ID` (`sl_ID`);

--
-- Indexes for table `sessionlogs`
--
ALTER TABLE `sessionlogs`
  ADD PRIMARY KEY (`SessionID`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `shop_banks`
--
ALTER TABLE `shop_banks`
  ADD PRIMARY KEY (`sbID`);

--
-- Indexes for table `special_reservation`
--
ALTER TABLE `special_reservation`
  ADD PRIMARY KEY (`srID`),
  ADD KEY `orID` (`orID`),
  ADD KEY `pid_Id` (`pid_Id`),
  ADD KEY `FK_OrderDetailID` (`orderDetailId`);

--
-- Indexes for table `st_order_review`
--
ALTER TABLE `st_order_review`
  ADD PRIMARY KEY (`stID`,`year`,`month`);

--
-- Indexes for table `subcat_one`
--
ALTER TABLE `subcat_one`
  ADD PRIMARY KEY (`sb_c_id`),
  ADD KEY `Ca_Id` (`Ca_Id`);

--
-- Indexes for table `subcat_two`
--
ALTER TABLE `subcat_two`
  ADD PRIMARY KEY (`sb_cc_id`),
  ADD KEY `sb_c_id` (`sb_c_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`s_ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `E_Id` (`E_Id`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `registration_no` (`registration_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accept_orders`
--
ALTER TABLE `accept_orders`
  MODIFY `ao_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accountnumbers`
--
ALTER TABLE `accountnumbers`
  MODIFY `acnID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booked_item`
--
ALTER TABLE `booked_item`
  MODIFY `bi_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `canceled_orders`
--
ALTER TABLE `canceled_orders`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cash_balance`
--
ALTER TABLE `cash_balance`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courier_pass`
--
ALTER TABLE `courier_pass`
  MODIFY `cpId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courier_pass_order`
--
ALTER TABLE `courier_pass_order`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courier_services`
--
ALTER TABLE `courier_services`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `damage_item`
--
ALTER TABLE `damage_item`
  MODIFY `diID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_note`
--
ALTER TABLE `delivery_note`
  MODIFY `delNoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_schedule`
--
ALTER TABLE `delivery_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_target_bonus`
--
ALTER TABLE `delivery_target_bonus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deposit_withdrawals`
--
ALTER TABLE `deposit_withdrawals`
  MODIFY `dwID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emp_leaves`
--
ALTER TABLE `emp_leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gatepass`
--
ALTER TABLE `gatepass`
  MODIFY `gatepassID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gatepass_details`
--
ALTER TABLE `gatepass_details`
  MODIFY `g_p_dID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `handover_cheque`
--
ALTER TABLE `handover_cheque`
  MODIFY `hcID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `issued_items`
--
ALTER TABLE `issued_items`
  MODIFY `delNoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_target_bonus`
--
ALTER TABLE `order_target_bonus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ords_card_pay`
--
ALTER TABLE `ords_card_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ords_cash_pay`
--
ALTER TABLE `ords_cash_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ords_cheque_pay`
--
ALTER TABLE `ords_cheque_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ords_credit_pay`
--
ALTER TABLE `ords_credit_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ords_pay_type`
--
ALTER TABLE `ords_pay_type`
  MODIFY `optId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ords_transfer_pay`
--
ALTER TABLE `ords_transfer_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_card_pay`
--
ALTER TABLE `ord_card_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_cash_pay`
--
ALTER TABLE `ord_cash_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_cheque_pay`
--
ALTER TABLE `ord_cheque_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_courier`
--
ALTER TABLE `ord_courier`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_credit_pay`
--
ALTER TABLE `ord_credit_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_pay_type`
--
ALTER TABLE `ord_pay_type`
  MODIFY `optId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ord_transfer_pay`
--
ALTER TABLE `ord_transfer_pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otherhire`
--
ALTER TABLE `otherhire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  MODIFY `psd_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_pay_type`
--
ALTER TABLE `purchase_pay_type`
  MODIFY `pptId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `p_i_detail`
--
ALTER TABLE `p_i_detail`
  MODIFY `pid_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recepitlog`
--
ALTER TABLE `recepitlog`
  MODIFY `Repid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `return_orders`
--
ALTER TABLE `return_orders`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sale_target`
--
ALTER TABLE `sale_target`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sal_loan_detail`
--
ALTER TABLE `sal_loan_detail`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessionlogs`
--
ALTER TABLE `sessionlogs`
  MODIFY `SessionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shop_banks`
--
ALTER TABLE `shop_banks`
  MODIFY `sbID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `special_reservation`
--
ALTER TABLE `special_reservation`
  MODIFY `srID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accept_orders`
--
ALTER TABLE `accept_orders`
  ADD CONSTRAINT `FK_accept_orders_orID` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `accept_orders_ibfk_1` FOREIGN KEY (`I_Id`) REFERENCES `item` (`I_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `accountnumbers`
--
ALTER TABLE `accountnumbers`
  ADD CONSTRAINT `accountnumbers_ibfk_1` FOREIGN KEY (`sbID`) REFERENCES `shop_banks` (`sbID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `booked_item`
--
ALTER TABLE `booked_item`
  ADD CONSTRAINT `booked_item_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booked_item_ibfk_2` FOREIGN KEY (`I_Id`) REFERENCES `item` (`I_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `canceled_orders`
--
ALTER TABLE `canceled_orders`
  ADD CONSTRAINT `canceled_orders_ibfk_1` FOREIGN KEY (`OrID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courier_pass`
--
ALTER TABLE `courier_pass`
  ADD CONSTRAINT `fk_courier_pass` FOREIGN KEY (`courier`) REFERENCES `courier_services` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `courier_pass_order`
--
ALTER TABLE `courier_pass_order`
  ADD CONSTRAINT `fk_courier_pass_order_cpId` FOREIGN KEY (`cpId`) REFERENCES `courier_pass` (`cpId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_courier_pass_order_orID` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `damage_item`
--
ALTER TABLE `damage_item`
  ADD CONSTRAINT `damage_item_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `damage_item_ibfk_2` FOREIGN KEY (`pid_Id`) REFERENCES `p_i_detail` (`pid_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `delivery`
--
ALTER TABLE `delivery`
  ADD CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_ibfk_2` FOREIGN KEY (`c_ID`) REFERENCES `customer` (`c_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_ibfk_3` FOREIGN KEY (`devID`) REFERENCES `driver` (`devID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `delivery_note`
--
ALTER TABLE `delivery_note`
  ADD CONSTRAINT `delivery_note_ibfk_1` FOREIGN KEY (`devID`) REFERENCES `driver` (`devID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `delivery_note_orders`
--
ALTER TABLE `delivery_note_orders`
  ADD CONSTRAINT `delivery_note_orders_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `delivery_note_orders_ibfk_2` FOREIGN KEY (`delNoID`) REFERENCES `delivery_note` (`delNoID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `deposit_withdrawals`
--
ALTER TABLE `deposit_withdrawals`
  ADD CONSTRAINT `deposit_withdrawals_ibfk_1` FOREIGN KEY (`acnID`) REFERENCES `accountnumbers` (`acnID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `driver_dept`
--
ALTER TABLE `driver_dept`
  ADD CONSTRAINT `driver_dept_ibfk_1` FOREIGN KEY (`devID`) REFERENCES `driver` (`devID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `emp_leaves`
--
ALTER TABLE `emp_leaves`
  ADD CONSTRAINT `emp_leaves_ibfk_1` FOREIGN KEY (`E_Id`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `gatepass`
--
ALTER TABLE `gatepass`
  ADD CONSTRAINT `gatepass_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `gatepass_details`
--
ALTER TABLE `gatepass_details`
  ADD CONSTRAINT `gatepass_details_ibfk_1` FOREIGN KEY (`gatepassID`) REFERENCES `gatepass` (`gatepassID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `gatepass_details_ibfk_2` FOREIGN KEY (`pid_Id`) REFERENCES `p_i_detail` (`pid_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `issued_items`
--
ALTER TABLE `issued_items`
  ADD CONSTRAINT `issued_items_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `issued_items_ibfk_2` FOREIGN KEY (`pid_Id`) REFERENCES `p_i_detail` (`pid_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `item_supplier`
--
ALTER TABLE `item_supplier`
  ADD CONSTRAINT `item_supplier_ibfk_1` FOREIGN KEY (`I_Id`) REFERENCES `item` (`I_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `item_supplier_ibfk_2` FOREIGN KEY (`s_ID`) REFERENCES `supplier` (`s_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`stID`) REFERENCES `sales_team` (`stID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`c_ID`) REFERENCES `customer` (`c_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_coupon`
--
ALTER TABLE `order_coupon`
  ADD CONSTRAINT `order_coupon_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_coupon_ibfk_2` FOREIGN KEY (`cpID`) REFERENCES `sales_coupon` (`cpID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_payment`
--
ALTER TABLE `order_payment`
  ADD CONSTRAINT `fk_order_customer` FOREIGN KEY (`c_ID`) REFERENCES `customer` (`c_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_payment_ibfk_1` FOREIGN KEY (`stID`) REFERENCES `sales_team` (`stID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_payment_ibfk_2` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ords_card_pay`
--
ALTER TABLE `ords_card_pay`
  ADD CONSTRAINT `ords_card_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ords_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ords_cash_pay`
--
ALTER TABLE `ords_cash_pay`
  ADD CONSTRAINT `ords_cash_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ords_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ords_cheque_pay`
--
ALTER TABLE `ords_cheque_pay`
  ADD CONSTRAINT `ords_cheque_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ords_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ords_credit_pay`
--
ALTER TABLE `ords_credit_pay`
  ADD CONSTRAINT `ords_credit_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ords_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ords_credit_pay_ibfk_2` FOREIGN KEY (`c_ID`) REFERENCES `customer` (`c_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ords_transfer_pay`
--
ALTER TABLE `ords_transfer_pay`
  ADD CONSTRAINT `ords_transfer_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ords_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_card_pay`
--
ALTER TABLE `ord_card_pay`
  ADD CONSTRAINT `ord_card_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ord_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_cash_pay`
--
ALTER TABLE `ord_cash_pay`
  ADD CONSTRAINT `ord_cash_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ord_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_cheque_pay`
--
ALTER TABLE `ord_cheque_pay`
  ADD CONSTRAINT `ord_cheque_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ord_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_courier`
--
ALTER TABLE `ord_courier`
  ADD CONSTRAINT `fk_ord_courier_orders` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_credit_pay`
--
ALTER TABLE `ord_credit_pay`
  ADD CONSTRAINT `ord_credit_pay_ibfk_1` FOREIGN KEY (`c_ID`) REFERENCES `customer` (`c_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ord_credit_pay_ibfk_2` FOREIGN KEY (`optId`) REFERENCES `ord_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_pay_type`
--
ALTER TABLE `ord_pay_type`
  ADD CONSTRAINT `ord_pay_type_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ord_transfer_pay`
--
ALTER TABLE `ord_transfer_pay`
  ADD CONSTRAINT `fk_ord_transfer_account` FOREIGN KEY (`acnID`) REFERENCES `accountnumbers` (`acnID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ord_transfer_pay_ibfk_1` FOREIGN KEY (`optId`) REFERENCES `ord_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `otherhire`
--
ALTER TABLE `otherhire`
  ADD CONSTRAINT `otherhire_ibfk_1` FOREIGN KEY (`customer`) REFERENCES `customer` (`c_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otherhire_ibfk_2` FOREIGN KEY (`vehicleID`) REFERENCES `vehicle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otherhire_ibfk_3` FOREIGN KEY (`driverId`) REFERENCES `driver` (`devID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pay_type_orders`
--
ALTER TABLE `pay_type_orders`
  ADD CONSTRAINT `fk_order` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pay_type` FOREIGN KEY (`optId`) REFERENCES `ords_pay_type` (`optId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pay_type_purchases`
--
ALTER TABLE `pay_type_purchases`
  ADD CONSTRAINT `pay_type_purchases_ibfk_1` FOREIGN KEY (`pptId`) REFERENCES `purchase_pay_type` (`pptId`),
  ADD CONSTRAINT `pay_type_purchases_ibfk_2` FOREIGN KEY (`pc_Id`) REFERENCES `purchase` (`pc_Id`);

--
-- Constraints for table `production`
--
ALTER TABLE `production`
  ADD CONSTRAINT `production_ibfk_1` FOREIGN KEY (`I_Id`) REFERENCES `item` (`I_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `production_ibfk_2` FOREIGN KEY (`s_ID`) REFERENCES `supplier` (`s_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`s_ID`) REFERENCES `supplier` (`s_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  ADD CONSTRAINT `purchase_detail_ibfk_1` FOREIGN KEY (`pc_Id`) REFERENCES `purchase` (`pc_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_detail_ibfk_2` FOREIGN KEY (`I_Id`) REFERENCES `item` (`I_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchase_payment`
--
ALTER TABLE `purchase_payment`
  ADD CONSTRAINT `purchase_payment_ibfk_1` FOREIGN KEY (`pc_Id`) REFERENCES `purchase` (`pc_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_payment_ibfk_2` FOREIGN KEY (`s_ID`) REFERENCES `supplier` (`s_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `p_i_detail`
--
ALTER TABLE `p_i_detail`
  ADD CONSTRAINT `p_i_detail_ibfk_1` FOREIGN KEY (`I_Id`) REFERENCES `item` (`I_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `p_i_detail_ibfk_2` FOREIGN KEY (`pc_Id`) REFERENCES `purchase` (`pc_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recepitlog`
--
ALTER TABLE `recepitlog`
  ADD CONSTRAINT `recepitlog_ibfk_1` FOREIGN KEY (`chashier`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recepitlog_ibfk_2` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`E_Id`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `return_orders`
--
ALTER TABLE `return_orders`
  ADD CONSTRAINT `return_orders_ibfk_1` FOREIGN KEY (`OrID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `salary_advance`
--
ALTER TABLE `salary_advance`
  ADD CONSTRAINT `salary_advance_ibfk_1` FOREIGN KEY (`E_Id`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `salary_loan`
--
ALTER TABLE `salary_loan`
  ADD CONSTRAINT `salary_loan_ibfk_1` FOREIGN KEY (`E_Id`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales_coupon`
--
ALTER TABLE `sales_coupon`
  ADD CONSTRAINT `sales_coupon_ibfk_1` FOREIGN KEY (`stID`) REFERENCES `sales_team` (`stID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales_team`
--
ALTER TABLE `sales_team`
  ADD CONSTRAINT `sales_team_ibfk_1` FOREIGN KEY (`E_Id`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sal_loan_detail`
--
ALTER TABLE `sal_loan_detail`
  ADD CONSTRAINT `sal_loan_detail_ibfk_1` FOREIGN KEY (`sl_ID`) REFERENCES `salary_loan` (`sl_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessionlogs`
--
ALTER TABLE `sessionlogs`
  ADD CONSTRAINT `sessionlogs_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `special_reservation`
--
ALTER TABLE `special_reservation`
  ADD CONSTRAINT `FK_OrderDetailID` FOREIGN KEY (`orderDetailId`) REFERENCES `order_detail` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `special_reservation_ibfk_1` FOREIGN KEY (`orID`) REFERENCES `orders` (`OrID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `special_reservation_ibfk_2` FOREIGN KEY (`pid_Id`) REFERENCES `p_i_detail` (`pid_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `st_order_review`
--
ALTER TABLE `st_order_review`
  ADD CONSTRAINT `st_order_review_ibfk_1` FOREIGN KEY (`stID`) REFERENCES `sales_team` (`stID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subcat_one`
--
ALTER TABLE `subcat_one`
  ADD CONSTRAINT `subcat_one_ibfk_1` FOREIGN KEY (`Ca_Id`) REFERENCES `category` (`Ca_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subcat_two`
--
ALTER TABLE `subcat_two`
  ADD CONSTRAINT `subcat_two_ibfk_1` FOREIGN KEY (`sb_c_id`) REFERENCES `subcat_one` (`sb_c_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`E_Id`) REFERENCES `employee` (`E_Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
