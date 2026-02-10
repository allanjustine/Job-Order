<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class OtherUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $rawUsers = [
            // SMCT (branch_id = 2)
            ['SMCT Molave', 'MOLS', 2],
            ['SMCT Turno', 'SDIP', 2],
            ['SMCT Aklan', 'AKLA', 2],
            ['SMCT Antique', 'ANTI', 2],
            ['SMCT Argao', 'SARG', 2],
            ['SMCT Bantayan', 'BANTA', 2],
            ['SMCT Baybay', 'BAYB', 2],
            ['SMCT Binan', 'BINAN', 2],
            ['SMCT Calape 2', 'CALAP2', 2],
            ['SMCT Carcar', 'CARS', 2],
            ['SMCT Carmen', 'CARMB', 2],
            ['SMCT Carmona', 'CARMO', 2],
            ['SMCT Catarman', 'CATAR', 2],
            ['SMCT Dasmariñas', 'DASMA', 2],
            ['SMCT Famy', 'FAMY', 2],
            ['SMCT Guindulman', 'GUIN', 2],
            ['SMCT Guindulman 2', 'GUIN2', 2],
            ['SMCT Jagna', 'JAGN', 2],
            ['SMCT Lapu-Lapu', 'SLAP', 2],
            ['SMCT Liloan', 'SLIL', 2],
            ['SMCT Lipa', 'LIPA', 2],
            ['SMCT Loay', 'LOAY', 2],
            ['Logistics', 'CAGL', 2],
            ['Logistics 2', 'DIPL', 2],
            ['Logistics 3', 'OZAL', 2],
            ['Logistics 4', 'ZAML', 2],
            ['Logistics Mandaue', 'MANL', 2],
            ['SMCT Madridejos', 'MADRI', 2],
            ['SMCT Manga', 'MANG', 2],
            ['SMCT Naic', 'NAIC', 2],
            ['SMCT Pagsanjan', 'PAGS', 2],
            ['SMCT Rosario', 'SROS', 2],
            ['SMCT Sagbayan', 'SAGBA', 2],
            ['SMCT San Jose', 'SANJ', 2],
            ['SMCT San Pedro', 'SANP', 2],
            ['SMCT Santander 2', 'SANT2', 2],
            ['SMCT Silang', 'SILA', 2],
            ['SMCT Talibon', 'TALI', 2],
            ['SMCT Talibon 2', 'TALI2', 2],
            ['SMCT Tanza', 'TANZ', 2],
            ['SMCT Tanza 2', 'TANZ2', 2],
            ['SMCT Trinidad', 'TRINI', 2],
            ['SMCT Trinidad 2', 'TRINI2', 2],
            ['SMCT Tubigon', 'TUBI', 2],
            ['SMCT Valencia', 'VALEN', 2],
            ['SMCT Yati Liloan', 'YATI', 2],
            ['SMCT Property Ventures Corporation', 'SPVC', 2],
            ['SMCT Loon', 'LOON', 2],
            ['SMCT Abuyog', 'ABUY', 2],

            // DSM (branch_id = 3)
            ['DSM Panabo', 'DSMPO', 3],
            ['DSM Rizal Pagadian', 'RIZA', 3],
            ['DSM Santo Tomas', 'TOMAS', 3],
            ['Suzuki Ozamiz', 'DSMSO', 3],
            ['DSM Tacurong', 'TACU', 3],
            ['DSM Tagbilaran 2', 'DSMT2', 3],
            ['DSM Tagum', 'DSMTG', 3],
            ['DSM Toril', 'TORI', 3],
            ['DSM Valencia', 'DSMV', 3],
            ['DSM Villanueva', 'VILLA', 3],
            ['DSM Argao', 'DSMAO', 3],
            ['DSM Balamban', 'DSMBN', 3],
            ['DSM Basak', 'DSMB', 3],
            ['DSM Bogo Multi', 'BOGO', 3],
            ['DSM Calinog Y3s', 'CALIN', 3],
            ['DSM Cambaro', 'DSMA', 3],
            ['DSM Carcar', 'CARC', 3],
            ['DSM Carcar 2', 'CARC2', 3],
            ['DSM Carmen', 'DSMDN', 3],
            ['DSM Carmen 2', 'CARMC2', 3],
            ['DSM Catmon', 'DSMCN', 3],
            ['DSM Compostela', 'COMPO', 3],
            ['DSM Consolacion', 'DSMP', 3],
            ['DSM Daanbantayan 2', 'DAAN', 3],
            ['DSM Danao', 'DANAO', 3],
            ['DSM Iloilo', 'ILOI', 3],
            ['DSM Labangon', 'DSMK', 3],
            ['DSM Lapu-Lapu 2', 'LAPU', 3],
            ['DSM Liloan', 'DSMLN', 3],
            ['DSM Mandaue Multi', 'MAND', 3],
            ['DSM Mandaue Y3s', 'MAND2', 3],
            ['DSM Medellin', 'MEDE', 3],
            ['DSM Pardo', 'PARD', 3],
            ['DSM Pardo 2 Suzuki 3s', 'PARD2', 3],
            ['DSM San Remigio', 'REMI', 3],
            ['DSM San Remigio 2', 'REMI2', 3],
            ['DSM Talamban', 'DSMTA', 3],
            ['DSM Toledo', 'DSML', 3],
            ['DSM Toledo 2', 'DSMDM', 3],
            ['DSM Tuburan', 'TUBU', 3],
            ['DSM Ubay', 'UBAY', 3],
            ['DSM Bolod', 'BOLOD', 3],
            ['DSM Catarman', 'CATAR2', 3],
            ['DSM Monkayo', 'MONKA', 3],
            ['Surplus Car Production', 'MANP', 3],
            ['Suzuki Auto Bohol', 'DSMSB', 3],
            ['DSM Nabunturan', 'NABU', 3],
            ['DSM Bayugan', 'BAYU', 3],
            ['DSM Norzagaray', 'NORZA', 3],
            ['DSM Tanza 3', 'TANZ3', 3],
            ['DSM Tacloban', 'UTAP', 3],
            ['DSM Gingoog', 'GINGO', 3],
            ['DSM Calbayog', 'CALB', 3],
            ['DSM Sablayan', 'SABLA', 3],
            ['DSM Quezon', 'QUEZ', 3],
            ['DSM Panglao 3s', 'PANGL', 3],
            ['DSM Kabacan', 'KABAC', 3],
            ['DSM Isulan', 'ISU', 3],
            ['DSM Butuan', 'BUTU', 3],
            ['DSM Toledo Y3s', 'TOLED', 3],
            ['DSM Asturias', 'ASTUR', 3],
            ['DSM Santa', 'SANTA', 3],
            ['DSM Suzuki Auto Iligan', 'DSMSI', 3],
            ['DSM Balasan', 'BALAS', 3],
            ['DSM Kibawe', 'KIBA', 3],
            ['DSM General Maxilom', 'GENMAX', 3],
            ['DSM Kiba Landscape', 'KIBAL', 3],
            ['DSM Buenavista', 'BUEN', 3],
            ['DSM Calapan', 'CALAPM', 3],
            ['DSM Surigao', 'GAISA', 3],
            ['DSM Cabadbaran', 'CABA', 3],
            ['DSM Bacolod', 'BACO', 3],
            ['DSM Pinamalayan', 'PINA', 3],
            ['DSM Jaro', 'JARO', 3],
            ['DSM Victoria', 'VICTO', 3],
            ['DSM Passi', 'PASI', 3],

            // HD (branch_id = 4)
            ['HD Alano', 'ALAH', 4],
            ['HD Aurora', 'AURH', 4],
            ['HD Buug', 'BUUH', 4],
            ['HD Calamba', 'CALA', 4],
            ['HD Camino Nuevo', 'CAMH', 4],
            ['HD Datoc', 'DATH', 4],
            ['HD General Trias', 'GENT', 4],
            ['HD Gusa', 'GUSA', 4],
            ['HD Initao', 'INIT', 4],
            ['HD Ipil', 'IPIH', 4],
            ['HD Kabasalan', 'KABA', 4],
            ['HD Maranding', 'MARH', 4],
            ['HD Molave', 'MOLH', 4],
            ['HD Oroquieta', 'OROH', 4],
            ['HD Oroquieta 2', 'OROH2', 4],
            ['HD Ozamiz', 'OZAH', 4],
            ['HD Sindangan', 'SINDA', 4],
            ['HD Vetrans', 'VETH', 4],
            ['HD Villanueva', 'VILLA2', 4],
            ['HD Balamban', 'BALAM', 4],
            ['HD Calinog', 'CALIN2', 4],
            ['HD Carmen', 'CARMC', 4],
            ['HD Pardo', 'PARD3', 4],
            ['HD Inabanga', 'INAB', 4],
            ['HD Tanza', 'TANH', 4],
            ['HD San Pablo', 'SANPA', 4],
            ['HD Sara', 'SARA', 4],
            ['HD Rawis', 'RAWIS', 4],

            // DAP (branch_id = 5)
            ['DAP Alano', 'ALAD', 5],
            ['DAP Aurora', 'AURD', 5],
            ['DAP Balingasag', 'BALD', 5],
            ['DAP Bonifacio', 'BONI', 5],
            ['DAP Buug', 'BUUD', 5],
            ['DAP Calamba', 'CALD', 5],
            ['DAP Camino Nuevo', 'CAMD', 5],
            ['DAP Dapitan', 'DAPI', 5],
            ['DAP Dipolog', 'DIPD', 5],
            ['DAP Dipolog 2', 'DIPD2', 5],
            ['DAP Iligan', 'ILID', 5],
            ['DAP Imelda', 'IMED', 5],
            ['DAP Initao', 'INIT2', 5],
            ['DAP Ipil', 'IPID', 5],
            ['DAP Jimenez', 'JIME', 5],
            ['DAP Kabasalan', 'KABD', 5],
            ['DAP Labason', 'LABD', 5],
            ['DAP Liloy', 'LILD', 5],
            ['DAP Manolo Fortich', 'MANO', 5],
            ['DAP Maramag', 'MARA2', 5],
            ['DAP Maranding', 'MARD', 5],
            ['DAP Molave', 'MOLD', 5],
            ['DAP Molave 2', 'MOLD2', 5],
            ['DAP Nuñez', 'NUND2', 5],
            ['DAP Oroquieta', 'OROD', 5],
            ['DAP Ozamiz', 'OZAD', 5],
            ['DAP Ozamiz (Rizal)', 'RIZD', 5],
            ['DAP Putik', 'PUTD', 5],
            ['DAP San Miguel', 'SANM', 5],
            ['DAP Sindangan', 'SIND', 5],
            ['DAP Sucabon', 'SUCD', 5],
            ['DAP Tubod', 'TUBOD', 5],
            ['DAP Vitali', 'VITA', 5],
            ['DAP Oroquieta 2', 'OROD2', 5],
            ['DAP Bayog', 'BAYOG', 5],
        ];


    $password = Hash::make('Smct123456');
    $now = now();

    $employeeRole = Role::query()
            ->where("name", RoleName::EMPLOYEE?->value)
            ->first();


    $users = collect($rawUsers)->map(fn ($u) => [
        'name'       => $u[0],
        'code'       => $u[1],
        'email'      => strtolower($u[1]) . '@gmail.com',
        'password'   => $password,
        'branch_id'  => $u[2],
        'created_at'=> $now,
        'updated_at'=> $now,
    ])->values()->toArray();

    User::insert($users);

    $users_uploaded = User::whereIn('code', collect($users)->pluck('code'))->get();

    $users_uploaded->each->assignRole($employeeRole);
}
}
