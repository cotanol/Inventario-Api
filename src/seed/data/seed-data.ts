import { TipoPermiso } from 'src/auth/entities/permiso.entity';
import { ValidPermissions } from 'src/auth/interfaces/valid-permissions.interface';

interface SeedUsuario {
  usuarioId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  dni: string;
  celular?: string;
  correoElectronico: string;
  clave: string;
}

interface SeedPerfil {
  perfilId: number;
  nombre: string;
  descripcion?: string;
}

interface SeedPermiso {
  permisoId: number;
  nombre: string;
  tipoPermiso: TipoPermiso;
  keyPermiso: string;
  urlMenu?: string;
  descripcion?: string;
  permisoPadreId?: number;
}

interface SeedPermisoPerfil {
  permisoId: number;
  perfilId: number;
  orden: number;
}

interface SeedUsuarioPerfil {
  usuarioId: number;
  perfilId: number;
}

interface SeedData {
  usuarios: SeedUsuario[];
  perfiles: SeedPerfil[];
  permisos: SeedPermiso[];
  permisosPerfiles: SeedPermisoPerfil[];
  usuariosPerfiles: SeedUsuarioPerfil[];
}

// === IDs USUARIOS ===
const user1Id = 1; // Admin
const user2Id = 2; // Vendedor

// === IDs PERFILES ===
const perfilAdminId = 1;
const perfilVendedorId = 2;

// === IDs PERMISOS - MENÚS PRINCIPALES ===
const menuUsuariosId = 1;
const menuProductosId = 2;
const menuClientesId = 3;
const menuMarcasId = 4;
const menuLineasId = 5;
const menuGruposId = 6;
const menuPerfilesId = 7;

// === IDs PERMISOS - ACCIONES DE USUARIOS ===
const verUsuariosId = 8;
const crearUsuarioId = 9;
const editarUsuarioId = 10;
const eliminarUsuarioId = 11;

// === IDs PERMISOS - ACCIONES DE PRODUCTOS ===
const verProductosId = 12;
const crearProductoId = 13;
const editarProductoId = 14;
const eliminarProductoId = 15;

// === IDs PERMISOS - ACCIONES DE CLIENTES ===
const verClientesId = 16;
const crearClienteId = 17;
const editarClienteId = 18;
const eliminarClienteId = 19;

// === IDs PERMISOS - ACCIONES DE MARCAS ===
const verMarcasId = 20;
const crearMarcaId = 21;
const editarMarcaId = 22;
const eliminarMarcaId = 23;

// === IDs PERMISOS - ACCIONES DE LÍNEAS ===
const verLineasId = 24;
const crearLineaId = 25;
const editarLineaId = 26;
const eliminarLineaId = 27;

// === IDs PERMISOS - ACCIONES DE GRUPOS ===
const verGruposId = 28;
const crearGrupoId = 29;
const editarGrupoId = 30;
const eliminarGrupoId = 31;

// === IDs PERMISOS - ACCIONES DE PERFILES ===
const verPerfilesId = 32;
const crearPerfilId = 33;
const editarPerfilId = 34;
const eliminarPerfilId = 35;

export const initialData: SeedData = {
  usuarios: [
    {
      usuarioId: user1Id,
      nombres: 'Carlos',
      apellidoPaterno: 'Rodriguez',
      dni: '99999999',
      correoElectronico: 'admin@gmail.com',
      clave: 'admin@123A',
    },
    {
      usuarioId: user2Id,
      nombres: 'Maria',
      apellidoPaterno: 'Gonzalez',
      apellidoMaterno: 'Lopez',
      dni: '88888888',
      celular: '987654321',
      correoElectronico: 'vendedor@gmail.com',
      clave: 'vendedor@123A',
    },
  ],
  perfiles: [
    {
      perfilId: perfilAdminId,
      nombre: 'administrador',
      descripcion: 'Acceso total al sistema',
    },
    {
      perfilId: perfilVendedorId,
      nombre: 'vendedor',
      descripcion: 'Acceso solo a gestión de clientes',
    },
  ],
  permisos: [
    // ========== MENÚS PRINCIPALES ==========
    {
      permisoId: menuUsuariosId,
      keyPermiso: 'MENU_USUARIOS',
      nombre: 'Usuarios',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/usuarios',
      descripcion: 'Gestión de usuarios del sistema',
    },
    {
      permisoId: menuProductosId,
      keyPermiso: 'MENU_PRODUCTOS',
      nombre: 'Productos',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/productos',
      descripcion: 'Gestión de productos',
    },
    {
      permisoId: menuClientesId,
      keyPermiso: 'MENU_CLIENTES',
      nombre: 'Clientes',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/clientes',
      descripcion: 'Gestión de clientes',
    },
    {
      permisoId: menuMarcasId,
      keyPermiso: 'MENU_MARCAS',
      nombre: 'Marcas',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/marcas',
      descripcion: 'Gestión de marcas',
    },
    {
      permisoId: menuLineasId,
      keyPermiso: 'MENU_LINEAS',
      nombre: 'Líneas',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/lineas',
      descripcion: 'Gestión de líneas',
    },
    {
      permisoId: menuGruposId,
      keyPermiso: 'MENU_GRUPOS',
      nombre: 'Grupos',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/grupos',
      descripcion: 'Gestión de grupos',
    },
    {
      permisoId: menuPerfilesId,
      keyPermiso: 'MENU_PERFILES',
      nombre: 'Perfiles',
      tipoPermiso: TipoPermiso.MENU,
      urlMenu: '/perfiles',
      descripcion: 'Gestión de perfiles y permisos',
    },

    // ========== ACCIONES DE USUARIOS ==========
    {
      permisoId: verUsuariosId,
      keyPermiso: ValidPermissions.VER_USUARIOS,
      nombre: 'Ver Usuarios',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite visualizar la lista de usuarios',
    },
    {
      permisoId: crearUsuarioId,
      keyPermiso: ValidPermissions.CREAR_USUARIO,
      nombre: 'Crear Usuario',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite crear nuevos usuarios',
    },
    {
      permisoId: editarUsuarioId,
      keyPermiso: ValidPermissions.EDITAR_USUARIO,
      nombre: 'Editar Usuario',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite modificar usuarios existentes',
    },
    {
      permisoId: eliminarUsuarioId,
      keyPermiso: ValidPermissions.ELIMINAR_USUARIO,
      nombre: 'Eliminar Usuario',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuUsuariosId,
      descripcion: 'Permite eliminar usuarios',
    },

    // ========== ACCIONES DE PRODUCTOS ==========
    {
      permisoId: verProductosId,
      keyPermiso: ValidPermissions.VER_PRODUCTOS,
      nombre: 'Ver Productos',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite visualizar la lista de productos',
    },
    {
      permisoId: crearProductoId,
      keyPermiso: ValidPermissions.CREAR_PRODUCTO,
      nombre: 'Crear Producto',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite crear nuevos productos',
    },
    {
      permisoId: editarProductoId,
      keyPermiso: ValidPermissions.EDITAR_PRODUCTO,
      nombre: 'Editar Producto',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite modificar productos existentes',
    },
    {
      permisoId: eliminarProductoId,
      keyPermiso: ValidPermissions.ELIMINAR_PRODUCTO,
      nombre: 'Eliminar Producto',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuProductosId,
      descripcion: 'Permite eliminar productos',
    },

    // ========== ACCIONES DE CLIENTES ==========
    {
      permisoId: verClientesId,
      keyPermiso: ValidPermissions.VER_CLIENTES,
      nombre: 'Ver Clientes',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite visualizar la lista de clientes',
    },
    {
      permisoId: crearClienteId,
      keyPermiso: ValidPermissions.CREAR_CLIENTE,
      nombre: 'Crear Cliente',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite crear nuevos clientes',
    },
    {
      permisoId: editarClienteId,
      keyPermiso: ValidPermissions.EDITAR_CLIENTE,
      nombre: 'Editar Cliente',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite modificar clientes existentes',
    },
    {
      permisoId: eliminarClienteId,
      keyPermiso: ValidPermissions.ELIMINAR_CLIENTE,
      nombre: 'Eliminar Cliente',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuClientesId,
      descripcion: 'Permite eliminar clientes',
    },

    // ========== ACCIONES DE MARCAS ==========
    {
      permisoId: verMarcasId,
      keyPermiso: ValidPermissions.VER_MARCAS,
      nombre: 'Ver Marcas',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite visualizar la lista de marcas',
    },
    {
      permisoId: crearMarcaId,
      keyPermiso: ValidPermissions.CREAR_MARCA,
      nombre: 'Crear Marca',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite crear nuevas marcas',
    },
    {
      permisoId: editarMarcaId,
      keyPermiso: ValidPermissions.EDITAR_MARCA,
      nombre: 'Editar Marca',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite modificar marcas existentes',
    },
    {
      permisoId: eliminarMarcaId,
      keyPermiso: ValidPermissions.ELIMINAR_MARCA,
      nombre: 'Eliminar Marca',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuMarcasId,
      descripcion: 'Permite eliminar marcas',
    },

    // ========== ACCIONES DE LÍNEAS ==========
    {
      permisoId: verLineasId,
      keyPermiso: ValidPermissions.VER_LINEAS,
      nombre: 'Ver Líneas',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite visualizar la lista de líneas',
    },
    {
      permisoId: crearLineaId,
      keyPermiso: ValidPermissions.CREAR_LINEA,
      nombre: 'Crear Línea',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite crear nuevas líneas',
    },
    {
      permisoId: editarLineaId,
      keyPermiso: ValidPermissions.EDITAR_LINEA,
      nombre: 'Editar Línea',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite modificar líneas existentes',
    },
    {
      permisoId: eliminarLineaId,
      keyPermiso: ValidPermissions.ELIMINAR_LINEA,
      nombre: 'Eliminar Línea',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuLineasId,
      descripcion: 'Permite eliminar líneas',
    },

    // ========== ACCIONES DE GRUPOS ==========
    {
      permisoId: verGruposId,
      keyPermiso: ValidPermissions.VER_GRUPOS,
      nombre: 'Ver Grupos',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite visualizar la lista de grupos',
    },
    {
      permisoId: crearGrupoId,
      keyPermiso: ValidPermissions.CREAR_GRUPO,
      nombre: 'Crear Grupo',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite crear nuevos grupos',
    },
    {
      permisoId: editarGrupoId,
      keyPermiso: ValidPermissions.EDITAR_GRUPO,
      nombre: 'Editar Grupo',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite modificar grupos existentes',
    },
    {
      permisoId: eliminarGrupoId,
      keyPermiso: ValidPermissions.ELIMINAR_GRUPO,
      nombre: 'Eliminar Grupo',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuGruposId,
      descripcion: 'Permite eliminar grupos',
    },

    // ========== ACCIONES DE PERFILES ==========
    {
      permisoId: verPerfilesId,
      keyPermiso: ValidPermissions.VER_PERFILES,
      nombre: 'Ver Perfiles',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite visualizar la lista de perfiles',
    },
    {
      permisoId: crearPerfilId,
      keyPermiso: ValidPermissions.CREAR_PERFIL,
      nombre: 'Crear Perfil',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite crear nuevos perfiles',
    },
    {
      permisoId: editarPerfilId,
      keyPermiso: ValidPermissions.EDITAR_PERFIL,
      nombre: 'Editar Perfil',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite modificar perfiles existentes',
    },
    {
      permisoId: eliminarPerfilId,
      keyPermiso: ValidPermissions.ELIMINAR_PERFIL,
      nombre: 'Eliminar Perfil',
      tipoPermiso: TipoPermiso.ACCION,
      permisoPadreId: menuPerfilesId,
      descripcion: 'Permite eliminar perfiles',
    },
  ],
  usuariosPerfiles: [
    { usuarioId: user1Id, perfilId: perfilAdminId },
    { usuarioId: user2Id, perfilId: perfilVendedorId },
  ],
  permisosPerfiles: [
    // ========== PERFIL ADMINISTRADOR (TODOS LOS PERMISOS) ==========
    // Menús
    { permisoId: menuUsuariosId, perfilId: perfilAdminId, orden: 10 },
    { permisoId: menuProductosId, perfilId: perfilAdminId, orden: 20 },
    { permisoId: menuClientesId, perfilId: perfilAdminId, orden: 30 },
    { permisoId: menuMarcasId, perfilId: perfilAdminId, orden: 40 },
    { permisoId: menuLineasId, perfilId: perfilAdminId, orden: 50 },
    { permisoId: menuGruposId, perfilId: perfilAdminId, orden: 60 },
    { permisoId: menuPerfilesId, perfilId: perfilAdminId, orden: 70 },

    // Acciones de Usuarios
    { permisoId: verUsuariosId, perfilId: perfilAdminId, orden: 11 },
    { permisoId: crearUsuarioId, perfilId: perfilAdminId, orden: 12 },
    { permisoId: editarUsuarioId, perfilId: perfilAdminId, orden: 13 },
    { permisoId: eliminarUsuarioId, perfilId: perfilAdminId, orden: 14 },

    // Acciones de Productos
    { permisoId: verProductosId, perfilId: perfilAdminId, orden: 21 },
    { permisoId: crearProductoId, perfilId: perfilAdminId, orden: 22 },
    { permisoId: editarProductoId, perfilId: perfilAdminId, orden: 23 },
    { permisoId: eliminarProductoId, perfilId: perfilAdminId, orden: 24 },

    // Acciones de Clientes
    { permisoId: verClientesId, perfilId: perfilAdminId, orden: 31 },
    { permisoId: crearClienteId, perfilId: perfilAdminId, orden: 32 },
    { permisoId: editarClienteId, perfilId: perfilAdminId, orden: 33 },
    { permisoId: eliminarClienteId, perfilId: perfilAdminId, orden: 34 },

    // Acciones de Marcas
    { permisoId: verMarcasId, perfilId: perfilAdminId, orden: 41 },
    { permisoId: crearMarcaId, perfilId: perfilAdminId, orden: 42 },
    { permisoId: editarMarcaId, perfilId: perfilAdminId, orden: 43 },
    { permisoId: eliminarMarcaId, perfilId: perfilAdminId, orden: 44 },

    // Acciones de Líneas
    { permisoId: verLineasId, perfilId: perfilAdminId, orden: 51 },
    { permisoId: crearLineaId, perfilId: perfilAdminId, orden: 52 },
    { permisoId: editarLineaId, perfilId: perfilAdminId, orden: 53 },
    { permisoId: eliminarLineaId, perfilId: perfilAdminId, orden: 54 },

    // Acciones de Grupos
    { permisoId: verGruposId, perfilId: perfilAdminId, orden: 61 },
    { permisoId: crearGrupoId, perfilId: perfilAdminId, orden: 62 },
    { permisoId: editarGrupoId, perfilId: perfilAdminId, orden: 63 },
    { permisoId: eliminarGrupoId, perfilId: perfilAdminId, orden: 64 },

    // Acciones de Perfiles
    { permisoId: verPerfilesId, perfilId: perfilAdminId, orden: 71 },
    { permisoId: crearPerfilId, perfilId: perfilAdminId, orden: 72 },
    { permisoId: editarPerfilId, perfilId: perfilAdminId, orden: 73 },
    { permisoId: eliminarPerfilId, perfilId: perfilAdminId, orden: 74 },

    // ========== PERFIL VENDEDOR (SOLO CLIENTES) ==========
    { permisoId: menuClientesId, perfilId: perfilVendedorId, orden: 10 },
    { permisoId: verClientesId, perfilId: perfilVendedorId, orden: 11 },
    { permisoId: crearClienteId, perfilId: perfilVendedorId, orden: 12 },
    { permisoId: editarClienteId, perfilId: perfilVendedorId, orden: 13 },
    { permisoId: eliminarClienteId, perfilId: perfilVendedorId, orden: 14 },
  ],
};
