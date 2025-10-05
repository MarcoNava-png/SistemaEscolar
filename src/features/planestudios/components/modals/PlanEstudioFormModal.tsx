"use client"

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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PeriodoAcademicoItem } from '@/features/periodoacademico/Types/PeriodoAcademicoItems';
import { NivelEducativoItem } from '@/features/niveleducativo/types/NivelEducativoItems';
import { CampusItem } from '@/features/campus/types/CampusItem';
import { Periodisidad } from '@/features/periodoacademico/Types/Periodisidad';

const baseSchema = z.object({
  clavePlanEstudios: z.string().min(1, 'Clave requerida'),
  nombrePlanEstudios: z.string().min(1, 'Nombre requerido'),
  rvoe: z.string().optional().or(z.literal('')),
  permiteAdelantar: z.boolean().default(false),
  version: z.string().min(1, 'Versión requerida').max(2, 'Versión muy larga'),
  duracionMeses: z.coerce.number().int().min(0),
  minimaAprobatoriaParcial: z.coerce.number().min(0),
  minimaAprobatoriaFinal: z.coerce.number().min(0),
  idPeriodicidad: z.coerce.number().int().min(0),
  idNivelEducativo: z.coerce.number().int().min(0),
  idCampus: z.coerce.number().int().min(0),
});

const createSchema = baseSchema;
const editSchema = baseSchema.extend({}).partial();

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

interface PlanEstudioFormModalProps {
  isOpen: boolean;
  periodos: Periodisidad[];
  nivelEducativo: NivelEducativoItem[];
  campus: CampusItem[];
  onClose: () => void;
  onSubmit: (data: CreateValues | EditValues) => Promise<void>;
  initial?: Partial<CreateValues & { idPlanEstudios?: number; status?: number }> | null;
  isSubmitting?: boolean;
}

export default function PlanEstudioFormModal({ isOpen, periodos, nivelEducativo, campus, onClose, onSubmit, initial = null, isSubmitting = false }: PlanEstudioFormModalProps) {
  const isEdit = Boolean(initial && (initial as any).idPlanEstudios);

  const form = useForm<CreateValues | EditValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: {
      clavePlanEstudios: '',
      nombrePlanEstudios: '',
      rvoe: '',
      permiteAdelantar: false,
      version: '1.0',
      duracionMeses: 0,
      minimaAprobatoriaParcial: 0,
      minimaAprobatoriaFinal: 0,
      idPeriodicidad: 0,
      idNivelEducativo: 0,
      idCampus: 0,
    },
  });

  useEffect(() => {
    if (initial) {
      form.reset({
        clavePlanEstudios: initial.clavePlanEstudios ?? '',
        nombrePlanEstudios: initial.nombrePlanEstudios ?? '',
        rvoe: initial.rvoe ?? '',
        permiteAdelantar: Boolean(initial.permiteAdelantar),
        version: initial.version ?? '1',
        duracionMeses: initial.duracionMeses ?? 0,
        minimaAprobatoriaParcial: initial.minimaAprobatoriaParcial ?? 0,
        minimaAprobatoriaFinal: initial.minimaAprobatoriaFinal ?? 0,
        idPeriodicidad: initial.idPeriodicidad ?? 0,
        idNivelEducativo: initial.idNivelEducativo ?? 0,
        idCampus: initial.idCampus ?? 0,
      } as any);
    } else {
      form.reset(undefined);
    }
  }, [initial, form, isOpen]);

  const handleSubmit = async (data: CreateValues | EditValues) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (err) {
      console.error('Error submitting form', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar plan de estudios' : 'Nuevo plan de estudios'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza la información del plan de estudios.' : 'Completa la información para crear un nuevo plan.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="clavePlanEstudios" render={({ field }) => (
                <FormItem>
                  <FormLabel>Clave</FormLabel>
                  <FormControl>
                    <Input placeholder="Clave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="nombrePlanEstudios" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="rvoe" render={({ field }) => (
                <FormItem>
                  <FormLabel>RVOE</FormLabel>
                  <FormControl>
                    <Input placeholder="RVOE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="version" render={({ field }) => (
                <FormItem>
                  <FormLabel>Versión</FormLabel>
                  <FormControl>
                    <Input placeholder="1.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="duracionMeses" render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración (meses)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="permiteAdelantar" render={({ field }) => (
                <FormItem>
                  <FormLabel>Permite adelantar</FormLabel>
                  <FormControl>
                    <Checkbox checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="minimaAprobatoriaParcial" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mínima parcial</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="minimaAprobatoriaFinal" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mínima final</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="idPeriodicidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodicidad</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una periodicidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {periodos.map((periodo) => (
                          <SelectItem key={periodo.idPeriodicidad} value={periodo.idPeriodicidad.toString()}>
                            {periodo.descPeriodicidad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idNivelEducativo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel educativo</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un nivel educativo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nivelEducativo.map((nivel) => (
                          <SelectItem key={nivel.idNivelEducativo} value={nivel.idNivelEducativo.toString()}>
                            {nivel.descNivelEducativo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idCampus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campus</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un campus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campus.map((campusItem) => (
                          <SelectItem key={campusItem.idCampus} value={campusItem.idCampus.toString()}>
                            {campusItem.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
