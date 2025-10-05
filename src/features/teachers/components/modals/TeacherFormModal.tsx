'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeacherPayload } from '../../types/TeacherPayload';

// ——— Esquema base (sin password) ———
const baseSchema = z.object({
  email: z.string().email({ message: 'Por favor ingresa un correo electrónico válido.' }),
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  apellidoPaterno: z.string().min(2, { message: 'El apellido paterno es requerido.' }),
  apellidoMaterno: z.string().min(2, { message: 'El apellido materno es requerido.' }),
  calle: z.string().min(3, { message: 'La calle es requerida.' }),
  numero: z.string().min(1, { message: 'El número es requerido.' }),
  // Fecha en formato YYYY-MM-DD como string
  fechaNacimiento: z.string().min(1, { message: 'La fecha de nacimiento es requerida.' }),
  // Coerciona a number
  personaGeneroId: z.coerce.number().min(1, { message: 'Por favor selecciona un género.' }),
  especialidad: z.string().min(2, { message: 'La especialidad es requerida.' }),
  // Coerciona a number y pide ≥ 1
  codigoPostalId: z.coerce.number().int().min(1, { message: 'El código postal (ID) es requerido.' }),
});

// ——— Crear: password requerida ———
const createSchema = baseSchema.extend({
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z]).*$/, {
      message: 'La contraseña debe incluir al menos una letra mayúscula y una letra minúscula.',
    }),
});

// ——— Editar: password opcional ———
const editSchema = baseSchema.extend({
  password: z.string().optional(),
});

// Igualamos los tipos del form con el payload esperado
type TeacherFormValues = z.infer<typeof createSchema> | z.infer<typeof editSchema>;

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherPayload) => Promise<void>;
  teacher?: TeacherPayload;   // cuando editas
  isSubmitting?: boolean;
}

export function TeacherFormModal({
  isOpen,
  onClose,
  onSubmit,
  teacher,
  isSubmitting = false,
}: TeacherFormModalProps) {

  const isEdit = Boolean(teacher);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      email: '',
      password: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: new Date().toISOString().split('T')[0],
      calle: '',
      numero: '',
      personaGeneroId: 1,
      especialidad: '',
      codigoPostalId: 0,
    },
  });

  useEffect(() => {
    if (teacher) {
      form.reset({
        email: teacher.email ?? '',
        password: '', // opcional en edición
        nombre: teacher.nombre ?? '',
        apellidoPaterno: teacher.apellidoPaterno ?? '',
        apellidoMaterno: teacher.apellidoMaterno ?? '',
        fechaNacimiento: teacher.fechaNacimiento ?? new Date().toISOString().split('T')[0],
        calle: teacher.calle ?? '',
        numero: teacher.numero ?? '',
        personaGeneroId: teacher.personaGeneroId ?? 1,
        especialidad: teacher.especialidad ?? '',
        codigoPostalId: teacher.codigoPostalId ?? 0, // ✅ nombre correcto
      });
    } else {
      form.reset({
        email: '',
        password: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: new Date().toISOString().split('T')[0],
        calle: '',
        numero: '',
        personaGeneroId: 1,
        especialidad: '',
        codigoPostalId: 0, // ✅ nombre correcto
      });
    }
  }, [teacher, form, isOpen]);

  const handleSubmit = async (data: TeacherFormValues) => {
    try {
      // `data` ya trae codigoPostalId y personaGeneroId como number por el z.coerce
      await onSubmit(data as TeacherPayload);
      form.reset();
    } catch (error: unknown) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Profesor' : 'Nuevo Profesor'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza la información del profesor.' : 'Completa la información para agregar un nuevo profesor.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidoPaterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Paterno</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido paterno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellidoMaterno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido Materno</FormLabel>
                    <FormControl>
                      <Input placeholder="Apellido materno" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaNacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personaGeneroId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Masculino</SelectItem>
                        <SelectItem value="2">Femenino</SelectItem>
                        <SelectItem value="3">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calle</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codigoPostalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal (ID)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        // Nos aseguramos de enviar number al form state
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        min={1}
                        placeholder="Ej. 123"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="especialidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Especialidad del profesor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : isEdit ? 'Actualizar profesor' : 'Agregar profesor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
