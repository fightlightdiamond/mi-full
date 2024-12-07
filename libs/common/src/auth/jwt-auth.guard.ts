import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { UserDto } from '../dto';
import { AUTHENTICATE_PATTERN } from '@app/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) {
      return false;
    }

    const data = {
      Authentication: jwt,
    };
    return this.authClient.send<UserDto>(AUTHENTICATE_PATTERN, data).pipe(
      tap((res) => {
        //Check valid role
        this.checkRole(context, res);
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      }),
    );
  }

  /**
   * Check Role
   *
   * @param context
   * @param res
   */
  checkRole(context: ExecutionContext, res: UserDto) {
    //get role access buy @Roles
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (roles) {
      for (const role of roles) {
        if (!res.roles?.includes(role)) {
          this.logger.error('The user does not have valid roles.');
          throw new UnauthorizedException();
        }
      }
    }
  }
}
